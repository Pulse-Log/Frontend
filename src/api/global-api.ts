import { useGlobalState } from '@/contexts/global-state-context';
import { useCallback, useEffect, useState } from 'react';
import { ApiResponse, ApiError } from './types/api';
import { toast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';

export interface ErrorResponse {
  status: string;
  data: {
    statusCode: number;
    timestamp: string;
    path: string;
    message: string;
  };
}

function useGlobalApi<T>(apiCall: () => Promise<ApiResponse>, dependencies: any[] = [], globalLoader:boolean): {
  loading: boolean,
  data: any
}{
  const { setIsLoading, setError } = useGlobalState();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if(globalLoader) setIsLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data as ErrorResponse;
        errorMessage = errorResponse.data.message || errorResponse.data.statusCode.toString();
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage
      });

      setError(errorMessage);
    } finally {
      setLoading(false);
      if(globalLoader) setIsLoading(false);
    }
  },[]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {loading,data};
}

export default useGlobalApi;