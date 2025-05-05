import React from 'react';
import { FormField, FormData } from '@/types/registration';

interface InputFieldProps {
    field: FormField;
    value: any;
    uploadedFilePath?: string | null;
    error?: string;
    disabled?: boolean;
    onChange: (fieldId: string, value: any) => void;
    onFileChange: (fieldId: string, file: File, fieldConfig: FormField) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
    field,
    value,
    uploadedFilePath,
    error,
    disabled,
    onChange,
    onFileChange,
}) => {
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
                <div className="flex items-start">
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
                         {/* Use label tag for clickability */}
                         <label htmlFor={field.id} className="font-medium text-gray-700">{field.label}</label>
                         {/* Optional description */}
                         {/* <p className="text-gray-500">Optional description here.</p> */}
                         {errorMsg}
                     </div>
                 </div>
             );

        case 'file':
            return (
                <div className='!my-0'>
                    {label}
                    <input
                        type="file"
                        id={field.id}
                        name={field.id}
                        accept={field.accept}
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                if (field.maxFileSizeMB && file.size > field.maxFileSizeMB * 1024 * 1024) {
                                    alert(`File size exceeds the limit of ${field.maxFileSizeMB} MB.`);
                                    e.target.value = '';
                                    return;
                                }
                                onFileChange(field.id, file, field);
                            }
                        }}
                        disabled={disabled}
                        required={field.required && !uploadedFilePath}
                        className={`w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer ${error ? 'border border-red-500 rounded-lg' : ''}`} // Add border on error
                    />
                     {/* Display uploaded file info */}
                     {uploadedFilePath && (
                         <div className="text-xs text-green-700 mt-1 flex items-center break-all">
                             <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                             Uploaded: {uploadedFilePath.split('/').pop()} {/* Show filename */}
                             {/* Add a "Remove" button? Requires backend support or just clears state */}
                         </div>
                     )}
                     {/* Display file hints */}
                     <p className="text-xs text-gray-500 mt-1">
                        {field.maxFileSizeMB ? `Max size: ${field.maxFileSizeMB}MB. ` : ''}
                        {field.accept ? `Allowed types: ${field.accept.split(',').map(s => s.split('/')[1] || s).join(', ').toUpperCase()}.` : ''}
                    </p>
                    {errorMsg}
                </div>
            );

        case 'readonly':
             return (
                 <div className='!my-0'>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                    <input value={value ?? ''} readOnly {...commonProps} />
                    {/* No error message needed typically */}
                 </div>
             );

        default:
            return <p className="text-red-500">Unsupported field type: {(field as any).type}</p>;
    }
};