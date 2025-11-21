import { RegisterForm } from '@/components/register-form';
import { Suspense } from 'react';


const page = () => {
    return (
       <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Suspense fallback={<div>Cargando...</div>}>
        <RegisterForm />
    </Suspense>

            
        </div>
    );
};

export default page;