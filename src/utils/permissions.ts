import { ROLE_PERMISSIONS } from '../constants/role_permissions'

export function hasAccess(role: string, module: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(module) ?? false
}
