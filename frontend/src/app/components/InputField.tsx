import React, { ChangeEvent, DragEvent, useRef, useState, useEffect } from 'react';
import { FormField } from '@/types/registration';

interface InputFieldProps {
    field: FormField;
    value: any;
    uploadedFilePath?: string | null;
    error?: string;
    disabled?: boolean;
    onChange: (fieldId: string, value: any) => void;
    onFileChange: (fieldId: string, file: File, fieldConfig: FormField) => void;
}

const PdfIcon: React.FC<{ className?: string }> = ({ className = "h-12 w-12 mb-2 text-red-500" }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        viewBox="0 0 303.188 303.188"
        xmlSpace="preserve"
    >
        <g>
            <polygon style={{ fill: '#E8E8E8' }} points="219.821,0 32.842,0 32.842,303.188 270.346,303.188 270.346,50.525  " />
            <path style={{ fill: '#FB3449' }} d="M230.013,149.935c-3.643-6.493-16.231-8.533-22.006-9.451c-4.552-0.724-9.199-0.94-13.803-0.936   c-3.615-0.024-7.177,0.154-10.693,0.354c-1.296,0.087-2.579,0.199-3.861,0.31c-1.314-1.36-2.584-2.765-3.813-4.202   c-7.82-9.257-14.134-19.755-19.279-30.664c1.366-5.271,2.459-10.772,3.119-16.485c1.205-10.427,1.619-22.31-2.288-32.251   c-1.349-3.431-4.946-7.608-9.096-5.528c-4.771,2.392-6.113,9.169-6.502,13.973c-0.313,3.883-0.094,7.776,0.558,11.594   c0.664,3.844,1.733,7.494,2.897,11.139c1.086,3.342,2.283,6.658,3.588,9.943c-0.828,2.586-1.707,5.127-2.63,7.603   c-2.152,5.643-4.479,11.004-6.717,16.161c-1.18,2.557-2.335,5.06-3.465,7.507c-3.576,7.855-7.458,15.566-11.815,23.02   c-10.163,3.585-19.283,7.741-26.857,12.625c-4.063,2.625-7.652,5.476-10.641,8.603c-2.822,2.952-5.69,6.783-5.941,11.024   c-0.141,2.394,0.807,4.717,2.768,6.137c2.697,2.015,6.271,1.881,9.4,1.225c10.25-2.15,18.121-10.961,24.824-18.387   c4.617-5.115,9.872-11.61,15.369-19.465c0.012-0.018,0.024-0.036,0.037-0.054c9.428-2.923,19.689-5.391,30.579-7.205   c4.975-0.825,10.082-1.5,15.291-1.974c3.663,3.431,7.621,6.555,11.939,9.164c3.363,2.069,6.94,3.816,10.684,5.119   c3.786,1.237,7.595,2.247,11.528,2.886c1.986,0.284,4.017,0.413,6.092,0.335c4.631-0.175,11.278-1.951,11.714-7.57   C231.127,152.765,230.756,151.257,230.013,149.935z M119.144,160.245c-2.169,3.36-4.261,6.382-6.232,9.041   c-4.827,6.568-10.34,14.369-18.322,17.286c-1.516,0.554-3.512,1.126-5.616,1.002c-1.874-0.11-3.722-0.937-3.637-3.065   c0.042-1.114,0.587-2.535,1.423-3.931c0.915-1.531,2.048-2.935,3.275-4.226c2.629-2.762,5.953-5.439,9.777-7.918   c5.865-3.805,12.867-7.23,20.672-10.286C120.035,158.858,119.587,159.564,119.144,160.245z M146.366,75.985   c-0.602-3.514-0.693-7.077-0.323-10.503c0.184-1.713,0.533-3.385,1.038-4.952c0.428-1.33,1.352-4.576,2.826-4.993   c2.43-0.688,3.177,4.529,3.452,6.005c1.566,8.396,0.186,17.733-1.693,25.969c-0.299,1.31-0.632,2.599-0.973,3.883   c-0.582-1.601-1.137-3.207-1.648-4.821C147.945,83.048,146.939,79.482,146.366,75.985z M163.049,142.265   c-9.13,1.48-17.815,3.419-25.979,5.708c0.983-0.275,5.475-8.788,6.477-10.555c4.721-8.315,8.583-17.042,11.358-26.197   c4.9,9.691,10.847,18.962,18.153,27.214c0.673,0.749,1.357,1.489,2.053,2.22C171.017,141.096,166.988,141.633,163.049,142.265z    M224.793,153.959c-0.334,1.805-4.189,2.837-5.988,3.121c-5.316,0.836-10.94,0.167-16.028-1.542   c-3.491-1.172-6.858-2.768-10.057-4.688c-3.18-1.921-6.155-4.181-8.936-6.673c3.429-0.206,6.9-0.341,10.388-0.275   c3.488,0.035,7.003,0.211,10.475,0.664c6.511,0.726,13.807,2.961,18.932,7.186C224.588,152.585,224.91,153.321,224.793,153.959z" />
            <polygon style={{ fill: '#FB3449' }} points="227.64,25.263 32.842,25.263 32.842,0 219.821,0  " />
            <g>
                <path style={{ fill: '#A4A9AD' }} d="M126.841,241.152c0,5.361-1.58,9.501-4.742,12.421c-3.162,2.921-7.652,4.381-13.472,4.381h-3.643    v15.917H92.022v-47.979h16.606c6.06,0,10.611,1.324,13.652,3.971C125.321,232.51,126.841,236.273,126.841,241.152z     M104.985,247.387h2.363c1.947,0,3.495-0.546,4.644-1.641c1.149-1.094,1.723-2.604,1.723-4.529c0-3.238-1.794-4.857-5.382-4.857    h-3.348C104.985,236.36,104.985,247.387,104.985,247.387z" />
                <path style={{ fill: '#A4A9AD' }} d="M175.215,248.864c0,8.007-2.205,14.177-6.613,18.509s-10.606,6.498-18.591,6.498h-15.523v-47.979    h16.606c7.701,0,13.646,1.969,17.836,5.907C173.119,235.737,175.215,241.426,175.215,248.864z M161.76,249.324    c0-4.398-0.87-7.657-2.609-9.78c-1.739-2.122-4.381-3.183-7.926-3.183h-3.773v26.877h2.888c3.939,0,6.826-1.143,8.664-3.43    C160.841,257.523,161.76,254.028,161.76,249.324z" />
                <path style={{ fill: '#A4A9AD' }} d="M196.579,273.871h-12.766v-47.979h28.355v10.403h-15.589v9.156h14.374v10.403h-14.374    L196.579,273.871L196.579,273.871z" />
            </g>
            <polygon style={{ fill: '#D1D3D3' }} points="219.821,50.525 270.346,50.525 219.821,0  " />
        </g>
    </svg>
);

const GenericFileIcon: React.FC<{ className?: string }> = ({ className = "h-12 w-12 mb-2 text-gray-400" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const DefaultUploadIcon: React.FC<{ isDragging: boolean; className?: string }> = ({ isDragging, className }) => (
    <svg className={className || `h-12 w-12 mb-3 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 31.332 31.332" xmlSpace="preserve" aria-hidden="true">
        <path d="M23.047,15.266c0.781,0.781,0.781,2.047,0,2.828l-7.381,7.381l-7.379-7.379c-0.781-0.781-0.781-2.046,0-2.828 c0.78-0.781,2.047-0.781,2.827,0l2.552,2.551V8.686c0-1.104,0.896-2,2-2c1.104,0,2,0.896,2,2v9.132l2.553-2.553 C21,14.484,22.268,14.484,23.047,15.266z M31.332,15.666c0,8.639-7.027,15.666-15.666,15.666C7.026,31.332,0,24.305,0,15.666 C0,7.028,7.026,0,15.666,0C24.307,0,31.332,7.028,31.332,15.666z M27.332,15.666C27.332,9.233,22.1,4,15.666,4 C9.233,4,4,9.233,4,15.666C4,22.1,9.233,27.332,15.666,27.332C22.1,27.332,27.332,22.1,27.332,15.666z" />
    </svg>
);


export const InputField: React.FC<InputFieldProps> = ({
    field,
    value,
    uploadedFilePath: initialUploadedFilePath,
    error,
    disabled,
    onChange,
    onFileChange,
}) => {
    const uploadedFilePath = initialUploadedFilePath || (field.type === 'file' || field.type === 'file-drag-drop' ? value as string : null);


    const commonProps = {
        id: field.id,
        name: field.id,
        required: field.required,
        disabled: disabled || field.readOnly,
        className: `w-full border ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition ${field.readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`,
        placeholder: field.placeholder,
    };

    const label = (
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
    );

    const errorMsg = error && <p className="text-xs text-red-600 mt-1">{error}</p>;

    const fileHints = (
        <p className="text-xs text-gray-500 mt-1">
            {field.maxFileSizeMB ? `Max size: ${field.maxFileSizeMB}MB. ` : ''}
            {field.accept ? `Allowed types: ${field.accept.split(',').map(s => s.split('/')[1]?.toUpperCase() || s.toUpperCase()).join(', ')}.` : ''}
        </p>
    );
    const confirmedUploadedFileDisplay = uploadedFilePath && (field.type === 'file' || field.type === 'file-drag-drop') && (
        <div className="text-xs text-green-700 mt-1 flex items-center break-all">
            <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            Uploaded: {uploadedFilePath.split('/').pop() || uploadedFilePath}
        </div>
    );

    switch (field.type) {
        case 'text':
        case 'email':
        case 'tel':
        case 'number':
            return (
                <div className='!my-0'>
                    {label}
                    <input
                        type={field.type}
                        value={value ?? ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        pattern={field.pattern}
                        title={field.title}
                        min={field.min}
                        max={field.max}
                        {...commonProps}
                    />
                    {errorMsg}
                </div>
            );

        case 'textarea':
            return (
                <div className='!my-0'>
                    {label}
                    <textarea
                        value={value ?? ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        rows={4}
                        {...commonProps}
                    />
                    {errorMsg}
                </div>
            );

        case 'select':
            return (
                <div className='!my-0'>
                    {label}
                    <select
                        value={value ?? ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        {...commonProps}
                    >
                        <option value="" disabled>{field.placeholder || `Select ${field.label}`}</option>
                        {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {errorMsg}
                </div>
            );

        case 'radio':
            return (
                <div className='!my-0'>
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                    </span>
                    <div className="space-y-1 mt-1">
                        {field.options?.map(opt => (
                            <label key={opt.value} className="flex items-center space-x-2 text-sm text-gray-800">
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={opt.value}
                                    checked={value === opt.value}
                                    onChange={(e) => onChange(field.id, e.target.value)}
                                    required={field.required}
                                    disabled={disabled}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                />
                                <span>{opt.label}</span>
                            </label>
                        ))}
                    </div>
                    {errorMsg}
                </div>
            );

        case 'checkbox':
            return (
                <div className="flex items-start !my-0">
                    <div className="flex items-center h-5">
                        <input
                            id={field.id}
                            name={field.id}
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => onChange(field.id, e.target.checked)}
                            required={field.required}
                            disabled={disabled}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor={field.id} className="font-medium text-gray-700">{field.label}</label>
                        {errorMsg}
                    </div>
                </div>
            );

        case 'file': {
            const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
            const [localSelectedFileName, setLocalSelectedFileName] = useState<string | null>(null);
            const [localSelectedFileType, setLocalSelectedFileType] = useState<string | null>(null);
            const [localSelectedFileExtension, setLocalSelectedFileExtension] = useState<string | null>(null);
            const fileInputRef = useRef<HTMLInputElement>(null);

            useEffect(() => {
                if (uploadedFilePath) {
                    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
                    setLocalPreviewUrl(null);
                    setLocalSelectedFileName(uploadedFilePath.split('/').pop() || null);
                    setLocalSelectedFileType(null);
                    setLocalSelectedFileExtension(null);
                }
            }, [uploadedFilePath]);

            useEffect(() => {
                return () => {
                    if (localPreviewUrl) {
                        URL.revokeObjectURL(localPreviewUrl);
                    }
                };
            }, [localPreviewUrl]);

            const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];

                if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
                setLocalPreviewUrl(null);
                setLocalSelectedFileName(null);
                setLocalSelectedFileType(null);
                setLocalSelectedFileExtension(null);

                if (file) {
                    if (field.maxFileSizeMB && file.size > field.maxFileSizeMB * 1024 * 1024) {
                        alert(`File size exceeds the limit of ${field.maxFileSizeMB} MB.`);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        return;
                    }
                    if (field.accept) {
                        const acceptedTypes = field.accept.split(',').map(t => t.trim().toLowerCase());
                        const fileTypeLower = file.type.toLowerCase();
                        const fileNameLower = file.name.toLowerCase();
                        const isAccepted = acceptedTypes.some(type => {
                            if (type.startsWith('.')) return fileNameLower.endsWith(type);
                            if (type.endsWith('/*')) return fileTypeLower.startsWith(type.slice(0, -2));
                            return fileTypeLower === type;
                        });
                        if (!isAccepted) {
                            alert(`Invalid file type. Allowed types: ${field.accept.split(',').map(s => s.split('/')[1]?.toUpperCase() || s.toUpperCase()).join(', ')}`);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                            return;
                        }
                    }

                    setLocalSelectedFileName(file.name);
                    setLocalSelectedFileType(file.type.toLowerCase());
                    const nameParts = file.name.split('.');
                    if (nameParts.length > 1) {
                        setLocalSelectedFileExtension(nameParts.pop()?.toLowerCase() || null);
                    }

                    if (file.type.startsWith('image/')) {
                        setLocalPreviewUrl(URL.createObjectURL(file));
                    }
                    onFileChange(field.id, file, field);
                }
            };

            let previewContent: React.ReactNode = null;
            const finalDisplayFileName = uploadedFilePath ? (uploadedFilePath.split('/').pop() || uploadedFilePath) : localSelectedFileName;

            const isUploadedImage = uploadedFilePath && /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(uploadedFilePath);
            const isUploadedPdf = uploadedFilePath && /\.pdf$/i.test(uploadedFilePath);

            const isLocalImage = localPreviewUrl && localSelectedFileType?.startsWith('image/');
            const isLocalPdf = localSelectedFileType === 'application/pdf' || localSelectedFileExtension === 'pdf';

            if (isUploadedImage) {
                previewContent = <img src={uploadedFilePath!} alt="Uploaded preview" className="mt-2 max-h-28 max-w-full object-contain rounded" />;
            } else if (isLocalImage) {
                previewContent = <img src={localPreviewUrl!} alt="Selected preview" className="mt-2 max-h-28 max-w-full object-contain rounded" />;
            } else if (isUploadedPdf) {
                previewContent = (
                    <div className="mt-2 flex items-center space-x-2 p-2 border border-gray-200 rounded bg-gray-50">
                        <PdfIcon className="h-10 w-10 flex-shrink-0" />
                        <p className="text-sm text-gray-700 truncate" title={finalDisplayFileName || ""}>{finalDisplayFileName}</p>
                    </div>
                );
            } else if (isLocalPdf) {
                previewContent = (
                    <div className="mt-2 flex items-center space-x-2 p-2 border border-gray-200 rounded bg-gray-50">
                        <PdfIcon className="h-10 w-10 flex-shrink-0" />
                        <p className="text-sm text-gray-700 truncate" title={finalDisplayFileName || ""}>{finalDisplayFileName}</p>
                    </div>
                );
            } else if (finalDisplayFileName) {
                previewContent = (
                    <div className="mt-2 flex items-center space-x-2 p-2 border border-gray-200 rounded bg-gray-50">
                        <GenericFileIcon className="h-8 w-8 flex-shrink-0 text-gray-400" />
                        <p className="text-sm text-gray-700 truncate" title={finalDisplayFileName || ""}>
                            {finalDisplayFileName}
                        </p>
                    </div>
                );
            }


            return (
                <div className='!my-0'>
                    {label}
                    <input
                        ref={fileInputRef}
                        type="file"
                        id={field.id}
                        name={field.id}
                        accept={field.accept}
                        onChange={handleFileChange}
                        disabled={disabled || field.readOnly}
                        required={field.required && !uploadedFilePath && !localSelectedFileName}
                        className={`w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer ${error ? 'border border-red-500 rounded-lg' : ''} ${field.readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                    {previewContent}
                    {confirmedUploadedFileDisplay}
                    {fileHints}
                    {errorMsg}
                </div>
            );
        }

        case 'file-drag-drop': {
            const [isDragging, setIsDragging] = useState(false);
            const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
            const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
            const [localFileType, setLocalFileType] = useState<string | null>(null);
            const fileInputRef = useRef<HTMLInputElement>(null);

            useEffect(() => {
                if (uploadedFilePath) {
                    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
                    setLocalPreviewUrl(null);
                    setSelectedFileName(null);
                    setLocalFileType(null);
                }
            }, [uploadedFilePath]);

            useEffect(() => {
                return () => {
                    if (localPreviewUrl) {
                        URL.revokeObjectURL(localPreviewUrl);
                    }
                };
            }, [localPreviewUrl]);


            const handleFileProcess = (file: File | undefined | null) => {
                if (localPreviewUrl) {
                    URL.revokeObjectURL(localPreviewUrl);
                }
                setLocalPreviewUrl(null);
                setSelectedFileName(null);
                setLocalFileType(null);

                if (file) {
                    if (field.maxFileSizeMB && file.size > field.maxFileSizeMB * 1024 * 1024) {
                        alert(`File size exceeds the limit of ${field.maxFileSizeMB} MB.`);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        return;
                    }
                    if (field.accept) {
                        const acceptedTypes = field.accept.split(',').map(t => t.trim().toLowerCase());
                        const fileTypeLower = file.type.toLowerCase();
                        const fileNameLower = file.name.toLowerCase();
                        const isAccepted = acceptedTypes.some(type => {
                            if (type.startsWith('.')) {
                                return fileNameLower.endsWith(type);
                            }
                            if (type.endsWith('/*')) {
                                return fileTypeLower.startsWith(type.slice(0, -2));
                            }
                            return fileTypeLower === type;
                        });

                        if (!isAccepted) {
                            alert(`Invalid file type. Allowed types: ${field.accept.split(',').map(s => s.split('/')[1]?.toUpperCase() || s.toUpperCase()).join(', ')}`);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                            return;
                        }
                    }

                    setSelectedFileName(file.name);
                    setLocalFileType(file.type);
                    if (file.type.startsWith('image/')) {
                        setLocalPreviewUrl(URL.createObjectURL(file));
                    }
                    onFileChange(field.id, file, field);
                }
            };

            const dragEventsDisabled = disabled || field.readOnly;

            const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
                e.preventDefault(); e.stopPropagation();
                if (dragEventsDisabled) return;
                setIsDragging(true);
            };
            const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
                e.preventDefault(); e.stopPropagation();
                if (dragEventsDisabled) return;
                setIsDragging(false);
            };
            const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
                e.preventDefault(); e.stopPropagation();
                if (dragEventsDisabled) return;
            };
            const handleDrop = (e: DragEvent<HTMLDivElement>) => {
                e.preventDefault(); e.stopPropagation();
                if (dragEventsDisabled) return;
                setIsDragging(false);
                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                    handleFileProcess(files[0]);
                    e.dataTransfer.clearData();
                }
            };
            const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
                if (dragEventsDisabled) return;
                const files = e.target.files;
                if (files && files.length > 0) {
                    handleFileProcess(files[0]);
                }
                if (e.target) e.target.value = '';
            };
            const openFileDialog = () => {
                if (dragEventsDisabled) return;
                fileInputRef.current?.click();
            };

            let dropzoneContent: React.ReactNode;
            let currentFileNameForDisplay: string | null = null;

            const isUploadedImage = uploadedFilePath && /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(uploadedFilePath);
            const isUploadedPdf = uploadedFilePath && /\.pdf$/i.test(uploadedFilePath);

            if (uploadedFilePath) {
                currentFileNameForDisplay = uploadedFilePath.split('/').pop() || uploadedFilePath;
                if (isUploadedImage) {
                    dropzoneContent = <img src={uploadedFilePath} alt={currentFileNameForDisplay} className="max-h-28 max-w-full object-contain rounded mx-auto mb-2" />;
                } else if (isUploadedPdf) {
                    dropzoneContent = <PdfIcon />;
                } else {
                    dropzoneContent = <GenericFileIcon />;
                }
            } else if (selectedFileName) {
                currentFileNameForDisplay = selectedFileName;
                if (localPreviewUrl && localFileType?.startsWith('image/')) {
                    dropzoneContent = <img src={localPreviewUrl} alt={selectedFileName} className="max-h-28 max-w-full object-contain rounded mx-auto mb-2" />;
                } else if (localFileType === 'application/pdf') {
                    dropzoneContent = <PdfIcon />;
                } else if (localFileType) {
                    dropzoneContent = <GenericFileIcon />;
                } else {
                    dropzoneContent = <DefaultUploadIcon isDragging={isDragging} />;
                }
            } else {
                dropzoneContent = <DefaultUploadIcon isDragging={isDragging} />;
            }

            const messageText = currentFileNameForDisplay || field.placeholder || "Drag & Drop or click to upload";

            return (
                <div className='!my-0'>
                    {label}
                    <div
                        id={`drop_container_${field.id}`}
                        className={`w-full flex flex-col items-center justify-center p-4 border-2 rounded-md transition-all
                            ${dragEventsDisabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'cursor-pointer'}
                            ${isDragging && !dragEventsDisabled ? 'border-indigo-600 bg-indigo-50 scale-105' : (error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400')}
                            ${error ? 'border-red-500' : (isDragging ? 'border-indigo-500' : 'border-dashed border-gray-400 hover:border-indigo-500')}
                        `}
                        style={{ minHeight: '180px' }}
                        onClick={openFileDialog}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        role="button"
                        tabIndex={dragEventsDisabled ? -1 : 0}
                        onKeyDown={(e) => { if (!dragEventsDisabled && (e.key === 'Enter' || e.key === ' ')) openFileDialog(); }}
                        aria-label={field.label || 'File upload drop zone'}
                        aria-disabled={dragEventsDisabled}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            id={field.id}
                            name={field.id}
                            accept={field.accept}
                            onChange={handleFileInputChange}
                            disabled={dragEventsDisabled}
                            required={field.required && !uploadedFilePath && !selectedFileName}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center text-center pointer-events-none w-full">
                            {dropzoneContent}
                            <p className={`text-sm max-w-full truncate px-2 ${currentFileNameForDisplay ? 'font-semibold text-gray-700' : 'text-gray-500'} ${isDragging ? 'text-indigo-700' : ''}`}>
                                {messageText}
                            </p>
                            {!currentFileNameForDisplay && field.placeholder && messageText !== field.placeholder && (
                                <p className="text-xs text-gray-400 mt-1">{field.placeholder}</p>
                            )}
                        </div>
                    </div>
                    {confirmedUploadedFileDisplay}
                    {fileHints}
                    {errorMsg}
                </div>
            );
        }

        case 'readonly':
            return (
                <div className='!my-0'>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                    <input value={value ?? ''} readOnly {...commonProps} className={`${commonProps.className} bg-gray-100 cursor-not-allowed`} />
                </div>
            );

        default:
            return <p className="text-red-500">Unsupported field type: {(field as any).type}</p>;
    }
};