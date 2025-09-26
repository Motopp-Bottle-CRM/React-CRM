export const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ['dashboard','users','contacts','leads','opportunities','cases','accounts','companies'],
  SALES: ['dashboard','leads', 'opportunities', 'accounts', 'contacts'],
  SALES_MANAGER: ['dashboard','leads', 'opportunities', 'accounts', 'contacts'],
  MARKETING: ['dashboard','leads','companies', 'contacts'],
  MARKETING_MANAGER: ['dashboard','companies','leads', 'contacts'],
  SUPPORT: ['dashboard','cases', 'contacts'],
}
