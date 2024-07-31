export interface ApiResponse{
    data: any;
    status: number;
    statusText: string;
  }
  
  export interface ApiError {
    message: string;
    status: number;
  }