import { Request } from "express";
export interface UserToken {
  id: number;
  email: string;
  username: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: UserToken;
}

export function isUserToken(obj: unknown): obj is UserToken {
  return (
    typeof obj === "object" &&
    "id" in obj &&
    typeof obj.id === "number" &&
    "email" in obj &&
    typeof obj.email === "string" &&
    "username" in obj &&
    typeof obj.username === "string" &&
    "role" in obj &&
    typeof obj.role === "string"
  );
}

export interface UserProfile {
  id: number;
  fname: string;
  lname: string;
  phone: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export function isUserProfile(obj: any): obj is UserProfile {
  return (
    typeof obj === "object" &&
    typeof obj.id === "number" &&
    typeof obj.fname === "string" &&
    typeof obj.lname === "string" &&
    typeof obj.phone === "string" &&
    typeof obj.username === "string" &&
    typeof obj.email === "string" &&
    typeof obj.created_at === "string" &&
    typeof obj.updated_at === "string"
  );
}
