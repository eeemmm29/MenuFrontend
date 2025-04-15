export interface User {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  // date_joined: string;
  // last_login: string;
  // is_active: boolean;
  // is_staff: boolean;
  // is_superuser: boolean;
  // groups: any[];
  // user_permissions: any[];
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}
