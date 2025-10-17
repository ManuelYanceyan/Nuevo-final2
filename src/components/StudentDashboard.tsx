import React from 'react';
import { Student } from '../types';
import { CreditCard, Calendar, DollarSign, Clock, CheckCircle, AlertCircle, LogOut, Upload, Eye } from 'lucide-react';
import { StudentAICard } from './StudentAICard';
import { StudentChatBot } from './StudentChatBot';

interface StudentDashboardProps {
  student: Student;
  onLogout: () => void;
  onUpdateStudent?: (updatedStudent: Student) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  student, 
  onLogout, 
  onUpdateStudent 
}) => {
  const [uploadingPaymentId, setUploadingPaymentId] = React.useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = React.useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const progressPercentage = ((student.totalDebt - student.remainingDebt) / student.totalDebt) * 100;

  const handleVoucherUpload = (paymentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUpdateStudent) return;

    setUploadingPaymentId(paymentId);

    // Simulate file upload
    setTimeout(() => {
      const updatedPayments = student.payments.map(payment => {
        if (payment.id === paymentId) {
          return {
            ...payment,
            voucherUrl: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString()
          };
        }
        return payment;
      });

      const updatedStudent: Student = {
        ...student,
        payments: updatedPayments
      };

      onUpdateStudent(updatedStudent);
      setUploadingPaymentId(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenido, {student.name}
              </h1>
              <p className="text-gray-600">ID: {student.studentId} | {student.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>

        {/* Account Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(student.status)}
                  {student.status === 'active' ? 'Activo' :
                   student.status === 'paid' ? 'Pagado' :
                   student.status === 'overdue' ? 'Vencido' : student.status}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Estado de Cuenta</h3>
            <p className="text-gray-600">Total: S/. {student.totalDebt.toFixed(2)}</p>
            <p className="text-gray-600">Restante: S/. {student.remainingDebt.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Fecha de Préstamo</h3>
            <p className="text-gray-600">{new Date(student.loanDate).toLocaleDateString('es-ES')}</p>
            <p className="text-sm text-gray-500 mt-1">Vencimiento: {new Date(student.dueDate).toLocaleDateString('es-ES')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Progreso de Pago</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{progressPercentage.toFixed(1)}% completado</p>
          </div>
        </div>

        {/* AI Analysis */}
        <StudentAICard student={student} />

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Pagos</h2>
          <div className="space-y-4">
            {student.payments.map((payment) => (
              <div
                key={payment.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.status === 'paid' ? 'bg-green-100' :
                      payment.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {getStatusIcon(payment.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{payment.description}</h4>
                      <p className="text-sm text-gray-600">
                        Vencimiento: {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                      </p>
                      {payment.date && (
                        <p className="text-sm text-green-600">
                          Pagado: {new Date(payment.date).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">S/. {payment.amount.toFixed(2)}</p>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {payment.status === 'paid' ? 'Pagado' :
                       payment.status === 'pending' ? 'Pendiente' : 'Vencido'}
                    </div>
                  </div>
                </div>

                {/* Voucher Upload Section */}
                <div className="border-t border-gray-100 pt-3">
                  {payment.voucherUrl ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Boucher subido correctamente</span>
                        {payment.uploadedAt && (
                          <span className="text-xs text-green-600">
                            ({new Date(payment.uploadedAt).toLocaleDateString('es-ES')})
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedVoucher(payment.voucherUrl!)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Boucher
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Subir Boucher de Pago</p>
                        <p className="text-xs text-gray-500">Formatos: JPG, PNG, PDF (máx. 5MB)</p>
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleVoucherUpload(payment.id, e)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingPaymentId === payment.id}
                        />
                        <button
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            uploadingPaymentId === payment.id
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                          disabled={uploadingPaymentId === payment.id}
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingPaymentId === payment.id ? 'Subiendo...' : 'Seleccionar Archivo'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voucher Preview Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-4 max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Boucher de Pago</h3>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img
              src={selectedVoucher}
              alt="Boucher de pago"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}

      {/* AI Chat Bot */}
      <StudentChatBot student={student} />
    </div>
  );
};