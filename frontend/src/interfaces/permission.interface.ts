import { User } from "./user.interface";
import { Role } from "./role.interface";

export interface Permission {
    
      id: number;
      name: string;
      description: string | null;

      roles?: Role[] | null;
      users?: User[] | null;
    
  }