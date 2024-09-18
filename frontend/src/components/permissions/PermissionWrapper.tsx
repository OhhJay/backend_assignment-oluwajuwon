import React from 'react';
import { PermissionWrapperProps } from '@/interfaces/permissionWrapper.interface';

const PermissionWrapper: React.FC<PermissionWrapperProps> = ({ user, roles = [], permissions = [], children }) => {
 
  // Log user's roles if they exist
  if (user?.roles?.length > 0) {
    const userRoles = user.roles.map((userRole) => userRole.role.name);
    
  }  

  // Log user's permissions if they exist
  if (user?.permissions?.length > 0) {
    const userPermissions = user.permissions.map((userPermission) => userPermission.permission.name);
      } else {
    }

  // Check if user has roles and if they match any of the provided roles
  const hasRole = user?.roles?.length > 0 && roles.some((role) => {
      const match = user.roles.some((userRole) => {
        return userRole.role.name.toLowerCase() === role.toLowerCase();
    });
 
    return match;
  }); 
  // Check if user has permissions and if they match any of the provided permissions
  const hasPermission = user?.permissions?.length > 0 && permissions.some((permission) => {
     const match = user.permissions.some((userPermission) => {
       return userPermission.permission.name.toLowerCase() === permission.toLowerCase();
    });
  
    return match;
  }); 

  // Render children only if the user has a matching role or permission
  if (hasRole || hasPermission) {
     return <>{children}</>;
  }

   return null;
};

export default PermissionWrapper;
