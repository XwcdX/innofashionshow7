import { FormSchema } from '@/types/registration';

export const contestSchema: FormSchema = [
    {
        id: 'userInfo',
        title: 'Your Information',
        fields: [
            { id: 'name', label: 'Name', type: 'text', defaultValue: '' },
            { id: 'email', label: 'Email', type: 'readonly', defaultValue: '' },
            { id: 'age', label: 'Age', type: 'number', required: true, min: 1, placeholder: "Your age" },
            { id: 'whatsapp', label: 'WhatsApp', type: 'tel', required: true, placeholder: '08XXXXXXXXXX', pattern: '^\\+?[0-9\\s\\-()]*$', title: "Enter a valid phone number" },
        ],
    },
    {
        id: 'internalDetails',
        title: 'Petra Student Details',
        condition: (formData, userType) => userType === 'INTERNAL',
        fields: [
            { id: 'nrp', label: 'NRP', type: 'text', required: true, pattern: '^[A-Za-z]\\d{8}$', title: "Enter NRP (e.g., c14200001)" },
            { id: 'batch', label: 'Batch', type: 'number', required: true, placeholder: "e.g., 2022", min: 2000, max: (new Date().getFullYear()) }, // Dynamic max year
            { id: 'major', label: 'Major', type: 'text', required: true, placeholder: "Your major" },
            {
                id: 'ktmPath', label: 'KTM (Student ID Card)', type: 'file', required: true,
                accept: 'image/jpeg,image/png,application/pdf',
                maxFileSizeMB: 2,
                filePurpose: 'ktm',
            },
        ],
    },
    {
        id: 'externalDetails',
        title: 'External User Details',
        condition: (formData, userType) => userType === 'EXTERNAL',
        fields: [
            { id: 'instance', label: 'Institution/School', type: 'text', required: true, placeholder: "Your institution name" },
            {
                id: 'idCardPath', label: 'ID Card (KTP/Student Card)', type: 'file', required: true,
                accept: 'image/jpeg,image/png,image/gif,application/pdf',
                maxFileSizeMB: 2,
                filePurpose: 'idCard',
            },
        ],
    },
    {
        id: 'Payment',
        title: 'Proof of Payment',
        fields: [
            {
                id: 'proofOfPayment',
                label: 'BCA: 0882829187 (A/N Sharone Hendrata) sebesar [PRICE]',
                labelTemplate: 'BCA: 0882829187 (A/N Sharone Hendrata) sebesar {PRICE}',
                type: 'file-drag-drop',
                required: true,
                accept: 'image/jpeg,image/png,application/pdf',
                maxFileSizeMB: 2,
                filePurpose: 'payment',
            },
        ],
    },
];

export const contestSubmitSchema: FormSchema = [
    {
        id: 'userInfo',
        title: 'Your Information',
        fields: [
            { id: 'name', label: 'Name', type: 'readonly', defaultValue: '' },
            { id: 'email', label: 'Email', type: 'readonly', defaultValue: '' },
        ],
    },
    {
        id: 'karyaFile',
        title: 'Creation Submit',
        fields: [
            {
                id: 'creationPath', label: 'Your Creation', type: 'file-drag-drop', required: true,
                accept: 'application/pdf',
                maxFileSizeMB: 5,
                filePurpose: 'creation',
            },
        ],
    },
    {
        id: 'conceptFile',
        title: 'Concept Submit',
        fields: [
            {
                id: 'conceptPath', label: 'Your Concept', type: 'file-drag-drop', required: true,
                accept: 'application/pdf',
                maxFileSizeMB: 5,
                filePurpose: 'concept',
            },
        ],
    },
];