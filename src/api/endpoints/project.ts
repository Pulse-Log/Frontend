import client from "../client/client";
import { ApiResponse } from "../types/api";

export const fetchAllProjects = (): Promise<ApiResponse> => client.get('/project');
export const createNewProject = (projectData:any): Promise<ApiResponse> => client.post('/project/new', projectData);
export const fetchAllInterfaces = (): Promise<ApiResponse> => client.get('/project/interfaces');
// export const createUser = (userData: Omit<User, 'id'>): Promise<ApiResponse<User>> => client.post('/users', userData);