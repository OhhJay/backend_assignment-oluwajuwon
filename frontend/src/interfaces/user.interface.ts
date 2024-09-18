import { Permission } from "./permission.interface";
import { Role } from "./role.interface";

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    token:string
    email: string;
    roles: UserRole[];
    permissions: UserPermission[];
  }

  // interfaces/user.interface.ts

export interface UserRole {
    id: number;
    userId: number;
    roleId: number;
    role: {
      id: number;
      name: string;
      description: string | null;
    };
  }

  export interface UserPermission {
    id: number;
    userId: number;
    permisionId: number;
    permission: {
      id: number;
      name: string;
      description: string | null;
    };
  }
  
  
  