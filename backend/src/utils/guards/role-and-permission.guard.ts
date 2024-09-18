import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; 
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    const strictRole = this.reflector.get<boolean>('strictRole', context.getHandler()) || false;
    const strictPermission = this.reflector.get<boolean>('strictPermission', context.getHandler()) || false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;  // The user should be populated by the JwtStrategy

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userWithPermissions = await this.userService.findUserWithPermissions(user.id);
    const roleIds = await this.userService.getRoleIdsByNames(requiredRoles || []);
    const permissionIds = await this.userService.getPermissionIdsByNames(requiredPermissions || []);

    // Strict Role Check: Enforce the user must have a specific role
    if (strictRole) {
      if (!this.hasRole(userWithPermissions, roleIds)) {
        throw new ForbiddenException('You do not have the required role');
      }
      return true;
    }

    // Strict Permission Check: Enforce the user must have specific permissions
    if (strictPermission) {
      if (!this.hasPermission(userWithPermissions, permissionIds)) {
        throw new ForbiddenException('You do not have the required permissions');
      }
      return true;
    }

    // If not strict, allow either role or permission to pass
    if (!this.hasRole(userWithPermissions, roleIds) && !this.hasPermission(userWithPermissions, permissionIds)) {
      throw new ForbiddenException('You do not have the required role or permission');
    }

    return true;
  }

  private hasRole(user: any, requiredRoleIds: number[]): boolean {
    if (!requiredRoleIds || requiredRoleIds.length === 0) return false;
    const userRoleIds = user.roles.map(role => role.roleId); // Adjust based on your schema
    return requiredRoleIds.some(id => userRoleIds.includes(id));
  }

  private hasPermission(user: any, requiredPermissionIds: number[]): boolean {
    if (!requiredPermissionIds || requiredPermissionIds.length === 0) return false;
    const userPermissionIds = user.permissions.map(permission => permission.permissionId); // Adjust based on your schema
    return requiredPermissionIds.some(id => userPermissionIds.includes(id));
  }
}
