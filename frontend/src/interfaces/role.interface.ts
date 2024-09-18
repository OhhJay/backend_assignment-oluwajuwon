import { Permission } from "./permission.interface";
import { User } from "./user.interface";
export interface Role {
    
      id: number;
      name: string;
      description: string | null;
      permissions?: RolePermission[] | null;
      users?: RoleUser[] | null;
    
  }


  export interface RoleUser {
    
    id: number;
    userId: number;
    roleId: number;
    user: User
  
}

  export interface RolePermission {
    
    id: number;
    permissionId: number;
    roleId: number;
    permission: Permission
  
}
  
  