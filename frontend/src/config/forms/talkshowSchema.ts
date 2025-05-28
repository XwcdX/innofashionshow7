import { FormSchema, UserType } from '@/types/registration';

export const talkshowSchema: FormSchema = [
    {
        id: 'userInfo',
        title: 'Your Information',
        fields: [
            { id: 'name', label: 'Name', type: 'text', defaultValue: '' },
            { id: 'email', label: 'Email', type: 'readonly', defaultValue: '' },
            { id: 'asal', label: 'Asal', type: 'text', defaultValue: '' },
            { id: 'idLine', label: 'ID Line', type: 'text', defaultValue: '' },
        ],
    },
    {
        id: 'payment',
        title: 'Payment',
        fields: [
            { id: 'whatsapp_ws', label: 'WhatsApp (for payment confirmation)', type: 'tel', required: true, placeholder: '+62...' }, // Use different ID if needed
            {
                id: 'proofPath_ws', label: 'Proof of Payment', type: 'file', required: true,
                accept: 'image/jpeg,image/png,application/pdf',
                maxFileSizeMB: 2,
                filePurpose: 'payment',
            },
        ]
    },
    {
        id: 'payment',
        title: 'Payment',
        fields: [
            { id: 'whatsapp_ws', label: 'WhatsApp (for payment confirmation)', type: 'tel', required: true, placeholder: '+62...' }, // Use different ID if needed
            {
                id: 'proofPath_ws', label: 'Proof of Payment', type: 'file', required: true,
                accept: 'image/jpeg,image/png,application/pdf',
                maxFileSizeMB: 2,
                filePurpose: 'payment',
            },
        ]
    },
];