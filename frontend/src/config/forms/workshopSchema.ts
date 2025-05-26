import { FormSchema, UserType } from '@/types/registration';

export const workshopSchema: FormSchema = [
    {
        id: 'userInfo',
        title: 'Your Information',
        fields: [
            { id: 'name', label: 'Name', type: 'text', defaultValue: '' },
            { id: 'email', label: 'Email', type: 'readonly', defaultValue: '' },
            { id: 'idline', label: 'ID Line', type: 'text', defaultValue: '' },     
            { id: 'wa', label: 'WhatsApp', type: 'tel', required: true, placeholder: '+62...' }, // Use different ID if needed
        ],
    },
    {
        id: 'internalDetails',
        title: 'Petra Student Details',
        condition: (formData, userType) => userType === 'INTERNAL',
        fields: [
            { id: 'nrp', label: 'NRP', type: 'text', required: true, pattern: '^[A-Za-z]\\d{8}$', title: "Enter NRP (e.g., c14200001)" },
            // { id: 'batch', label: 'Batch', type: 'number', required: true, placeholder: "e.g., 2022", min: 2000, max: (new Date().getFullYear()) }, // Dynamic max year
            { id: 'jurusan', label: 'Major', type: 'text', required: true, placeholder: "Your major" },
            // {
            //     id: 'ktmPath', label: 'KTM (Student ID Card)', type: 'file', required: true,
            //     accept: 'image/jpeg,image/png,application/pdf',
            //     maxFileSizeMB: 2,
            //     filePurpose: 'ktm',
            // },
        ],
    },
    {
        id: 'payment',
        title: 'Payment',
        fields: [
            {
                id: 'proofOfPayment', label: 'Proof of Payment', type: 'file', required: true,
                accept: 'image/jpeg,image/png,application/pdf',
                maxFileSizeMB: 2,
                filePurpose: 'payment',
            },
        ]
    },
];