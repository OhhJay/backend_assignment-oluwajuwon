import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

// New decorators for strict checks
export const StrictRole = () => SetMetadata('strictRole', true);
export const StrictPermission = () => SetMetadata('strictPermission', true);
