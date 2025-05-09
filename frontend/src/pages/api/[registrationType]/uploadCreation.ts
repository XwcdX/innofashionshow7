import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Part, File as FormidableFile } from 'formidable';
import fs from 'fs';
import path from 'path';

// --- Config ---
export const config = {
  api: {
    bodyParser: false,
  },
};

// --- Helper Functions ---
const ensureDirExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\s+/g, '_');
};

// --- Type Definitions ---
type RegistrationType = 'contest' | 'workshop' | 'talkshow';
type FilePurpose = 'payment' | 'ktm' | 'idCard' | 'creation' | 'concept';

const validRegistrationTypes: RegistrationType[] = ['contest', 'workshop', 'talkshow'];
const validFilePurposes: FilePurpose[] = ['payment', 'ktm', 'idCard', 'creation', 'concept'];

// --- Main API Handler ---
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tempUploadDir = path.join(process.cwd(), 'public', 'uploads', '_temp');
  ensureDirExists(tempUploadDir);

  // --- Initialize Formidable ---
  const form = formidable({
    uploadDir: tempUploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    filter: function (part: Part): boolean {
      const { name, originalFilename, mimetype } = part;
      if (name !== 'file') {
        return true;
      }
      const isFileType = !!(mimetype && originalFilename);
      if (!isFileType) return false;

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      const isAllowedType = !!(mimetype && allowedTypes.includes(mimetype));
      return isAllowedType;
    },
  });

  // --- Parse the form data ---
  let fields: formidable.Fields;
  let files: formidable.Files;
  let tempFilePath: string | undefined;

  try {
    [fields, files] = await form.parse(req);

    // --- Validate Required Fields ---
    const registrationTypeField = fields.registrationType?.[0];
    const filePurposeField = fields.filePurpose?.[0];
    const emailField = fields.email?.[0];
    const nameField = fields.name?.[0];
    const prevPathField = fields.prevPath?.[0];

    if (
      !registrationTypeField || !validRegistrationTypes.includes(registrationTypeField as RegistrationType) ||
      !filePurposeField || !validFilePurposes.includes(filePurposeField as FilePurpose) ||
      !emailField ||
      !nameField
    ) {
      return res.status(400).json({ message: 'Missing or invalid required fields: registrationType, filePurpose, email, name.' });
    }

    const registrationType = registrationTypeField as RegistrationType;
    const filePurpose = filePurposeField as FilePurpose;
    const email = emailField;
    const name = nameField;
    const prevPath = typeof prevPathField === 'string' ? prevPathField : undefined;


    // --- Get the uploaded file info ---
    const uploadedFile = files.file?.[0] as FormidableFile | undefined;

    if (!uploadedFile) {
      return res.status(400).json({ message: 'No valid file uploaded under the key "file", or file type not allowed.' });
    }
    tempFilePath = uploadedFile.filepath;

    // --- Handle Deletion of Previous File ---
    if (prevPath) {
      const expectedPrefix = `/uploads/${registrationType}/${filePurpose}/`;
      if (prevPath.startsWith('/uploads/') && path.normalize(prevPath).startsWith(path.normalize('/uploads/'))) {
        const fullPrevPath = path.join(process.cwd(), 'public', prevPath);
        try {
          if (fs.existsSync(fullPrevPath)) {
            fs.unlinkSync(fullPrevPath);
            console.log(`Deleted previous file: ${fullPrevPath}`);
          }
        } catch (unlinkError) {
          console.error(`Non-fatal: Failed to delete previous file ${fullPrevPath}:`, unlinkError);
        }
      } else {
        console.warn(`Skipping deletion of potentially unsafe prevPath: ${prevPath}`);
      }
    }


    // --- Construct Final Path and Filename ---
    const finalDir = path.join(process.cwd(), 'public', 'uploads', registrationType, filePurpose);
    ensureDirExists(finalDir);

    const timestamp = Date.now();
    const originalExtension = path.extname(uploadedFile.originalFilename || '.unknown');
    const sanitizedEmail = sanitizeFilename(email);
    const sanitizedName = sanitizeFilename(name);

    const finalFilename = `${registrationType}_${filePurpose}_${sanitizedEmail}_${sanitizedName}_${timestamp}${originalExtension}`;
    const finalFilePath = path.join(finalDir, finalFilename);

    fs.renameSync(uploadedFile.filepath, finalFilePath);
    tempFilePath = undefined;

    const publicPath = `/uploads/${registrationType}/${filePurpose}/${finalFilename}`;

    // --- Respond Success ---
    return res.status(200).json({ path: publicPath });

  } catch (error: any) {
    console.error('Error processing upload:', error);

    // --- Attempt to clean up temporary file if move failed ---
    if (tempFilePath) {
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
          console.log(`Cleaned up temporary file: ${tempFilePath}`);
        }
      } catch (cleanupError) {
        console.error(`Failed to cleanup temporary file ${tempFilePath}:`, cleanupError);
      }
    }

    // --- Specific Error Responses ---
    if (error.code === 'LIMIT_FILE_SIZE' || (error.message && error.message.includes('maxFileSize exceeded'))) {
      return res.status(413).json({ message: 'File too large. Maximum size allowed is 2MB.' });
    }
    if (error.message && error.message.includes('maxFieldsSize exceeded')) {
      return res.status(413).json({ message: 'Total size of form fields exceeded limit.' });
    }
    return res.status(500).json({ message: 'Failed to process file upload.', error: error.message });
  }
}