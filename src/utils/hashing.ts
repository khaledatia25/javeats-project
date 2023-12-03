import bcrypt from 'bcrypt';

export const hashPassword: (password: string) => string = (password) => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword: (
  password: string,
  hashedPassword: string,
) => boolean = (passowrd, hashedPassword) => {
  return bcrypt.compareSync(passowrd, hashedPassword);
};
