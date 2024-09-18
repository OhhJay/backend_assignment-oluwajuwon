export interface AccountPermissionWhereUniqueInput {
    accountId_permissionId: {
      accountId: number;
      permissionId: number;
    };
  }
  
  export type AccountPermissionUniqueInput = {
    accountId: number;
    permissionId: number;
  };