declare namespace Express {
  export interface Request {
    user: {
      id: string;
      role: 'patient' | 'professional' | 'manager';
    };
  }
}
