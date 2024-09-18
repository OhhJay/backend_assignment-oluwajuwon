import React, { ReactNode } from 'react';
import { User } from '@/interfaces/user.interface';

export interface PermissionWrapperProps {
  user: User; // User object with roles and permissions
  roles?: string[]; // Role name to check (e.g., 'admin')
  permissions?: string[]; // Permission name to check (e.g., 'view_documents')
  children: ReactNode; // Elements to render if user has the role/permission
}
 