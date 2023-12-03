export default class User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    role: string,
    phone: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.role = role;
    this.id = id;
  }
}
