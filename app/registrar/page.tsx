import { RegisterForm } from '@/components/register-form';


const page = () => {
    return (
       <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
            <RegisterForm />
        </div>
    );
};

export default page;