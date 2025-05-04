'use client';

import { RegistrationForm } from '@/app/components/RegistrationForm'; // Adjust path
import { contestSchema } from '@/config/forms/contestSchema'; // Adjust path

export default function ContestRegistrationPage() {
    // You might still need useSession here if you want to display
    // something specific outside the form based on the session,
    // but the form itself handles the core auth logic.

    return (
        <RegistrationForm
            registrationType="contest"
            formSchema={contestSchema}
            onSuccessRedirectPath="/"
        />
    );
}