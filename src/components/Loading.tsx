import { useGlobalState } from '@/contexts/global-state-context';
import React from 'react';

const GlobalLoadingIndicator: React.FC = () => {
  const { isLoading } = useGlobalState();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};

export default GlobalLoadingIndicator;
