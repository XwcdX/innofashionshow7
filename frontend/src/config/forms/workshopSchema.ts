import { FormSchema, UserType } from '@/types/registration';

export const workshopSchema: FormSchema = [
    {
        id: 'userInfo',
        title: 'Your Information',
        fields: [
            { id: 'name', label: 'Name', type: 'text', defaultValue: '' },
            { id: 'email', label: 'Email', type: 'readonly', defaultValue: '' },
            { id: 'idline', label: 'ID Line', type: 'text', defaultValue: '' },     
            { id: 'wa', label: 'WhatsApp', type: 'tel', required: true, placeholder: '08..........' },
        ],
    },
    {
        id: 'internalDetails',
        title: 'Petra Student Details',
        condition: (formData, userType) => userType === 'INTERNAL',
        fields: [
            { id: 'nrp', label: 'NRP', type: 'text', required: true, pattern: '^[A-Za-z]\\d{8}$', title: "Enter NRP (e.g., c14200001)" },
            { id: 'jurusan', label: 'Major', type: 'text', required: true, placeholder: "Your major" },
        ],
    },
    {
        id: 'payment',
        title: 'Payment',
        fields: [
            {
                id: 'proofOfPayment', 
                label: 'BCA: 0882829187 (A/N Sharone Hendrata) sebesar Rp 150.000,00\n\nBerita : Nama_WorkshopInno7', 
                type: 'file', required: true,     
                accept: 'image/jpeg,image/png,application/pdf',
                maxFileSizeMB: 2,
                filePurpose: 'payment',
            },
        ]
    },
];