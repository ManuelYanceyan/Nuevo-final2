export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  createdAt: string;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  totalDebt: number;
  remainingDebt: number;
  status: 'active' | 'overdue' | 'paid';
  payments: Payment[];
  loanDate: string;
  dueDate: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  description: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  voucherUrl?: string;
  uploadedAt?: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}