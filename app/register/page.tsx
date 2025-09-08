import { Suspense } from 'react';

export default function RegisterPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold text-gray-900 mb-2'>
              Welcome to Ragir
            </h1>
            <p className='text-lg text-gray-600'>
              Complete your organization registration to start offering amazing
              trips
            </p>
          </div>

          <Suspense
            fallback={
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <div className='animate-pulse space-y-4'>
                  <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                  <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                </div>
              </div>
            }
          >
            {/* <OrganizationRegistration /> */}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
