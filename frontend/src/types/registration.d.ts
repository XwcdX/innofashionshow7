export type RegistrationType = 'contest' | 'workshop' | 'talkshow';

export type FilePurpose = 'payment' | 'ktm' | 'idCard' | 'creation' | 'concept';

export type UserType = 'INTERNAL' | 'EXTERNAL';

export type Category = 'ADVANCED' | 'INTERMEDIATE';

export type TalkshowCategory = 'WEBINAR' | 'TALKSHOW_1' | 'TALKSHOW_2';

export type FieldType =
    | 'text'
    | 'number'
    | 'email'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'file'
    | 'file-drag-drop'
    | 'readonly';

export interface FormFieldOption {
    value: string | number;
    label: string;
}

export interface FormField {
    id: string;
    label: string;
    labelTemplate?: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    pattern?: string;
    title?: string;
    min?: number | string;
    max?: number | string;
    options?: FormFieldOption[];
    accept?: string;
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