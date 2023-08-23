interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Business Owner'],
  customerRoles: ['Customer'],
  tenantRoles: ['Business Owner', 'Account Manager', 'Meter Reader'],
  tenantName: 'Company',
  applicationName: 'PNG Application',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
};
