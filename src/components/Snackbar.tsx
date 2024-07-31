import { useGlobalState } from '@/contexts/global-state-context';
import React, { useEffect } from 'react';

const GlobalErrorSnackbar: React.FC = () => {
  const { error, setError } = useGlobalState();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
      {error}
    </div>
  );
};

export default GlobalErrorSnackbar;