// hooks/useOrganizationId.ts
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth';

export const useOrganizationId = (): string => {
  const { focusedOrganization } = useSelector(selectAuthState);
  if (!focusedOrganization) {
    throw new Error('Organization ID not available — user not authenticated?');
  }
  return focusedOrganization || '';
};
