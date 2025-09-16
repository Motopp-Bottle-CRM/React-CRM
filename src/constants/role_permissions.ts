export const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: [
    'Users',
    'Contacts',
    'Leads',
    'Opportunities',
    'Cases',
    'Accounts',
    'Companies',
  ],
  SALES: ['Leads', 'Opportunities', 'Accounts', 'Contacts'],
  SALES_MANAGER: ['Leads', 'Opportunities', 'Accounts', 'Contacts'],
  MARKETING: ['Leads', 'Contacts'],
  MARKETING_MANAGER: ['Leads', 'Contacts'],
  SUPPORT: ['Cases', 'Contacts'],
}
