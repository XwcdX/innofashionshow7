'use client';

import { RegistrationForm } from '@/app/components/RegistrationForm';
import { talkshowSchema } from '@/config/forms/talkshowSchema';

export default function WorkshopRegistrationPage() {
    return (
        <RegistrationForm
            registrationType="talkshow"
            formSchema={talkshowSchema}
            onSuccessRedirectPath="/my-workshops"
        />
    );
}