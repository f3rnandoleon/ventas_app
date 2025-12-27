export type UserRole = "ADMIN" | "VENDEDOR" | "CLIENTE";

export interface Usuario {
  _id: string;
  fullname: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

/* DTOs */
export interface CreateUsuarioDTO {
  fullname: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  password: string;
}

export interface UpdateUsuarioDTO {
  fullname?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
}
