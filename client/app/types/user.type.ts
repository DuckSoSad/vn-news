export interface User {
  name: string;
  username: string;
  email: string;
}

export interface ExtendedUser extends User {
  createdAt: Date;
}
