import { FormSchema, UserType } from '@/types/registration';

export const workshopSchema: FormSchema = [
    {
        id: 'userInfo',
        title: 'Your Information',
        fields: [
            { id: 'name', label: 'Name', type: 'readonly', defaultValue: '' },
            { id: 'email', label: 'Email', type: 'readonly', defaultValue: '' },
        ],
    },
    // {
    //     id: 'workshopDetails',
    //     title: 'Workshop Details',
    //     fields: [
    //         { id: 'motivation', label: 'Motivation for Joining', type: 'textarea', required: true, placeholder: "Why do you want to attend this workshop?" },
    //         { id: 'experience', label: 'Relevant Experience Level', type: 'select', required: true, options: [
    //             { value: 'beginner', label: 'Beginner' },
    //             { value: 'intermediate', label: 'Intermediate' },
    //             { value: 'advanced', label: 'Advanced' },
    //         ]},
    //         {
    //             id: 'cvPath', label: 'Upload CV (Optional)', type: 'file', required: false, // Optional field
    //             accept: 'application/pdf',
    //             maxFileSizeMB: 5,
    //             filePurpose: 'cv',
    //         },
    //     ],
    // },
     // Add payment section if workshop requires payment
     {
         id: 'payment',
         title: 'Payment',
         fields: [
             { id: 'whatsapp_ws', label: 'WhatsApp (for payment confirmation)', type: 'tel', required: true, placeholder: '+62...' }, // Use different ID if needed
             {
                 id: 'proofPath_ws', label: 'Proof of Payment', type: 'file', required: true,
                 accept: 'image/jpeg,image/png,application/pdf',
                 maxFileSizeMB: 2,
                 filePurpose: 'payment', // Can reuse purpose if backend handles context
             },
         ]
     },
    {
        id: 'confirmation',
        fields: [
            { id: 'confirmData_ws', label: 'I confirm the workshop details are correct.', type: 'checkbox', required: true }
        ]
    }
];