'use client';

import { RegistrationForm } from '@/app/components/RegistrationForm';
import { workshopSchema } from '@/config/forms/workshopSchema';

export default function WorkshopRegistrationPage() {
    return (
        <RegistrationForm
            registrationType="workshop"
            formSchema={workshopSchema}
        />
    );
}