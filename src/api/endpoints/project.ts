import client from "../client/client";
import { ApiResponse } from "../types/api";

export const fetchAllProjects = (): Promise<ApiResponse> => client.get('/project/all');
export const fetchProject = (projectId:string): Promise<ApiResponse> => client.get(`/project/${projectId}`);
export const fetchStack = (projectId:string, sId:string): Promise<ApiResponse> => client.get(`/project/${projectId}/stack/${sId}`);
export const createNewProject = (projectData:any): Promise<ApiResponse> => client.post('/project/new', projectData);
export const createNewStack = (stackData:any): Promise<ApiResponse> => client.post('/project/stack/new', stackData);
export const createNewComponent = (componentData:any): Promise<ApiResponse> => client.post('/project/stack/component/new', componentData);
export const fetchAllInterfaces = (): Promise<ApiResponse> => client.get('/project/interfaces');
export const fetchViewers = ():Promise<ApiResponse> => client.get('/project/viewers');
// export const createUser = (userData: Omit<User, 'id'>): Promise<ApiResponse<User>> => client.post('/users', userData);