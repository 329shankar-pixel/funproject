import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { login } from '@/routes';

export default function Register() {
    return (
        <>
            <Head title="Register" />
            <div className="flex flex-col gap-6 text-center">
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                    <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">Registration Disabled</h3>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                        Public self-registration is disabled. Only administrators can create accounts. Please contact the administrator for access.
                    </p>
                </div>
                <TextLink href={login()} className="text-sm">
                    Back to Log in
                </TextLink>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Registration disabled',
    description: 'Contact administrator for account access',
};
