import { Student, Admin, Payment } from '../types';

export const mockPayments: Payment[] = [
  {
    id: '1',
    amount: 500,
    date: '2025-04-15',
    description: 'Pago inicial del préstamo estudiantil',
    status: 'paid',
    dueDate: '2025-04-15'
  },
  {
    id: '2',
    amount: 500,
    date: '2025-05-15',
    description: 'Segunda cuota mensual',
    status: 'paid',
    dueDate: '2025-05-15'
  },
  {
    id: '3',
    amount: 500,
    date: '',
    description: 'Tercera cuota mensual',
    status: 'pending',
    dueDate: '2025-06-15'
  },
  {
    id: '4',
    amount: 500,
    date: '',
    description: 'Cuarta cuota mensual',
    status: 'pending',
    dueDate: '2025-07-15'
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    email: '2021200001@uncp.edu.pe',
    name: 'Ana García Mendoza',
    role: 'student',
    studentId: '2021200001',
    totalDebt: 2000,
    remainingDebt: 1000,
    status: 'active',
    payments: mockPayments,
    loanDate: '2025-04-01',
    dueDate: '2025-07-15',
    createdAt: '2025-04-01'
  },
  {
    id: '2',
    email: '2020180045@uncp.edu.pe',
    name: 'Carlos Rodríguez Silva',
    role: 'student',
    studentId: '2020180045',
    totalDebt: 1500,
    remainingDebt: 1500,
    status: 'overdue',
    payments: [
      {
        id: '5',
        amount: 375,
        date: '',
        description: 'Primera cuota mensual',
        status: 'overdue',
        dueDate: '2025-04-15'
      }
    ],
    loanDate: '2025-04-01',
    dueDate: '2025-04-15',
    createdAt: '2025-04-01'
  },
  {
    id: '3',
    email: '2019160078@uncp.edu.pe',
    name: 'María López Vargas',
    role: 'student',
    studentId: '2019160078',
    totalDebt: 3000,
    remainingDebt: 0,
    status: 'paid',
    payments: [
      {
        id: '6',
        amount: 1000,
        date: '2025-04-20',
        description: 'Pago completo del préstamo',
        status: 'paid',
        dueDate: '2025-04-20'
      }
    ],
    loanDate: '2025-04-01',
    dueDate: '2025-04-20',
    createdAt: '2025-04-01'
  }
];

export const mockAdmins: Admin[] = [
  {
    id: 'admin-1',
    email: '2021200794K@uncp.edu.pe',
    name: 'Manuel Administrador',
    role: 'admin',
    permissions: ['manage_students', 'manage_admins', 'view_reports'],
    createdAt: '2025-04-01'
  }
];

export const mockCredentials = {
  '2021200794K@uncp.edu.pe': 'Manuel110202'
};