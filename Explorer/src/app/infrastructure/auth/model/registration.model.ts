export interface RegistrationData {
  user: UserReg;
  person: PersonReg;
}

export interface UserReg {
  username: string;
  password: string;
  role: 1;
}

export interface PersonReg {
  name: string;
  surname: string;
  email: string;
  bio: string;
  quote: string;
}
