// Updated SwitchOrganization component with layout/CSS matching OrganizationsPage

'use client';

import { useState } from 'react';
import { ArrowLeftRight, Building2, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetOrganizationsQuery } from '@/lib/services/superadmin/organizations';
import { showSuccess } from '@/lib/utils/toastHelpers';
import { Sidebar } from '@/components/superadmin/sidebar';
import { AppHeader } from '@/components/app-header';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { OrganizationDTO } from '@/lib/services/superadmin/organizations/types';
import { json } from 'stream/consumers';
import { useDispatch } from 'react-redux';
import { setFocusedOrganization } from '@/lib/slices/auth';
import { useOrganizationId } from '@/hooks/useOrganizationId';

export default function SwitchOrganization() {
  const dispatch = useDispatch();
  const { getValue, setValue } = useLocalStorage();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDTO | null>(
    getValue('focusedOrganization'),
  );

  const { data, isLoading } = useGetOrganizationsQuery({ page: 0, size: 200 });
  const organizations = data?.content || [];

  const handleApply = () => {
    if (!selectedOrg) return;
    if (selectedOrg) {
      dispatch(setFocusedOrganization(selectedOrg.publicId));
      setValue('focusedOrganization', selectedOrg);
      showSuccess(`Organization switched to ${selectedOrg?.entityName}`);
    }

    window.location.reload();
  };

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50'>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Layout */}
      <div className='flex flex-col flex-1'>
        {/* Header */}
        <AppHeader
          title='Switch Organization'
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
          <div className='bg-white shadow-sm rounded-xl w-full max-w-3xl p-8 mx-auto'>
            {/* Title */}
            <div className='flex items-center space-x-3 mb-6'>
              <div className='p-4 bg-blue-100 rounded-full'>
                <ArrowLeftRight className='w-7 h-7 text-blue-700' />
              </div>
              <h1 className='text-2xl font-semibold text-gray-900'>
                Switch Organization
              </h1>
            </div>

            {/* Dropdown */}
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Select Organization
            </label>

            {isLoading ? (
              <div className='animate-pulse w-full h-12 bg-gray-200 rounded-lg' />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full border flex justify-between border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500'
                  >
                    {selectedOrg?.entityName ?? 'Select Organization'}
                    <ChevronDown className='w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-[600px'>
                  <DropdownMenuLabel>Select Organization</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {organizations.map((org) => (
                    <DropdownMenuItem
                      key={org.publicId}
                      onClick={() => {
                        setSelectedOrg(org);
                      }}
                    >
                      {org.entityName} ({org.status})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div></div>
            {/* Apply Button */}
            <Button
              onClick={handleApply}
              disabled={!selectedOrg}
              className='mt-6 w-full py-3 rounded-lg text-white font-medium disabled:bg-gray-400'
              style={{
                background:
                  'linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)',
              }}
            >
              Apply
            </Button>

            {/* Current Focused Org */}
            <div className='mt-8 p-5 bg-gray-50 rounded-xl border'>
              <h3 className='text-sm font-semibold text-gray-700 mb-3'>
                Current Focused Organization
              </h3>
              <div className='flex items-center space-x-3'>
                <Building2 className='w-6 h-6 text-gray-700' />
                <div>
                  <p className='font-semibold text-gray-800'>
                    {selectedOrg?.entityName}
                  </p>
                  <p className='text-sm text-gray-600'>{selectedOrg?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
