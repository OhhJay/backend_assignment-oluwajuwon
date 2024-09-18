import { User } from "./user.interface";

 
export interface CreateSampleData {
readonly id?: number;
  title: string;
  description?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  uploadedBy?: number;
  uploadedByUser?:User;
  sensitiveData?: string;
}