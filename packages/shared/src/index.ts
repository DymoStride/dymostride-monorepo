// Shared types with API
export interface User {
  id: string;
  email: string;
  name: string | null;
  message: string;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  name?: string;
}

export interface CreateProfileRequest {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}