export enum Permission {
  DASHBOARD_VIEW = 'dashboard:view',
  
  FINANCE_VIEW = 'finance:view',
  FINANCE_MANAGE = 'finance:manage',
  
  EXPENSES_VIEW = 'expenses:view',
  EXPENSES_CREATE = 'expenses:create',
  EXPENSES_APPROVE = 'expenses:approve',
  
  REPORTS_VIEW = 'reports:view',
  
  SYSTEM_MANAGE = 'system:manage',
  USERS_VIEW = 'users:view',
  USERS_MANAGE = 'users:manage',
  ROLES_MANAGE = 'roles:manage',
  SETTINGS_MANAGE = 'settings:manage',
}

export const RolePermissions = {
  ADMIN: Object.values(Permission),
  MANAGER: [
    Permission.DASHBOARD_VIEW,
    Permission.FINANCE_VIEW,
    Permission.EXPENSES_VIEW,
    Permission.EXPENSES_CREATE,
    Permission.REPORTS_VIEW,
    Permission.USERS_VIEW,
  ],
  USER: [
    Permission.DASHBOARD_VIEW,
    Permission.EXPENSES_VIEW,
    Permission.EXPENSES_CREATE,
  ],
};
