type LocalStorageKey =
  | 'organizationId'
  | 'accessToken'
  | 'refreshToken'
  | 'focusedOrganization';

export function useLocalStorage() {
  const getValue = (key: LocalStorageKey) => {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch {
        return value; // return raw string if not JSON
      }
    }
  };

  const setValue = (key: LocalStorageKey, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  };

  const removeValue = (key: LocalStorageKey) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  };

  const getAll = () => {
    if (typeof window === 'undefined') return {};
    const data: Record<string, any> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      try {
        data[key] = JSON.parse(localStorage.getItem(key)!);
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }

    return data;
  };

  const clearAll = () => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  };

  return {
    getValue,
    setValue,
    removeValue,
    getAll,
    clearAll,
  } as const;
}
