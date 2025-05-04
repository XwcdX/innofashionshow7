export type RegistrationType = 'contest' | 'workshop' | 'talkshow';

export type FilePurpose = 'payment' | 'ktm' | 'idCard';

export type UserType = 'INTERNAL' | 'EXTERNAL';

export type FieldType =
    | 'text'
    | 'number'
    | 'email'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'checkbox' // For single checkbox confirmation, not groups yet
    | 'file'
    | 'readonly'; // For displaying info like name/email

export interface FormFieldOption {
    value: string | number;
    label: string;
}

// Represents a single field in the form
export interface FormField {
    id: string; // Unique identifier for the field (used as key/name)
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    pattern?: string; // For input validation regex
    title?: string; // Tooltip for pattern
    min?: number | string; // For number/date types
    max?: number | string; // For number/date types
    options?: FormFieldOption[]; // For select/radio
    accept?: string; // For file type (e.g., "image/*,application/pdf")
    maxFileSizeMB?: number;
    filePurpose?: FilePurpose;
    condition?: (formData: Record<string, any>, userType: UserType) => boolean;
    defaultValue?: any;
    readOnly?: boolean;
}

export interface FormSection {
    id: string;
    title?: string;
    fields: FormField[];
    condition?: (formData: FormData, userType: UserType) => boolean;
}

export type FormSchema = FormSection[];

export type FormData = Record<string, any>;

export type UploadedFilePaths = Record<string, string | null>;