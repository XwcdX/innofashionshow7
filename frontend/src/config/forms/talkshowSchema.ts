import { FormSchema, UserType } from '@/types/registration';

export const talkshowSchema: FormSchema = [
    {
        id: 'userInfo',
        title: 'Your Information',
        fields: [
            { id: 'name', label: 'Name', type: 'text', defaultValue: '' },
            { id: 'email', label: 'Email', type: 'readonly', defaultValue: '' },
            { id: 'idline', label: 'ID Line', type: 'text', defaultValue: '' },     
            { id: 'wa', label: 'WhatsApp', type: 'tel', required: true, placeholder: '08...........' },
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
];