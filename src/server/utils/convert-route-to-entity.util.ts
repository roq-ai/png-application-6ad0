const mapping: Record<string, string> = {
  assignments: 'assignment',
  bills: 'bill',
  companies: 'company',
  customers: 'customer',
  'meter-readings': 'meter_reading',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
