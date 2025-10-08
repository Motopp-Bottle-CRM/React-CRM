export const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ['dashboard','users','contacts','leads','opportunities','cases','accounts','companies'],
  SALES: ['dashboard','leads', 'companies','opportunities', 'accounts', 'contacts'],
  SALES_MANAGER: ['dashboard','leads','companies', 'opportunities', 'accounts', 'contacts'],
  MARKETING: ['dashboard','leads', 'contacts'],
  MARKETING_MANAGER: ['dashboard','leads', 'contacts'],
  SUPPORT: ['dashboard','cases', 'contacts'],
}
