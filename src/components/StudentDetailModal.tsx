import React, { useState } from 'react';
import { Student, Payment } from '../types';
import { X, Upload, Calendar, DollarSign, CheckCircle, Clock, AlertCircle, Eye, Download } from 'lucide-react';
import { StudentAICard } from './StudentAICard';

interface StudentDetailModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onUpdateStudent
}) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [uploadingPaymentId, setUploadingPaymentId] = useState<string | null>(null);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
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
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleVoucherUpload = (paymentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPaymentId(paymentId);

    // Simulate file upload
    setTimeout(() => {
      const updatedPayments = student.payments.map(payment => {
        if (payment.id === paymentId) {
          return {
            ...payment,
            voucherUrl: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString(),
            status: 'paid' as const,
            date: new Date().toISOString().split('T')[0]
          };
        }
        return payment;
      });

      const paidAmount = updatedPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);

      const updatedStudent: Student = {
        ...student,
        payments: updatedPayments,
        remainingDebt: student.totalDebt - paidAmount,
        status: paidAmount >= student.totalDebt ? 'paid' : 'active'
      };

      onUpdateStudent(updatedStudent);
      setUploadingPaymentId(null);
    }, 1500);
  };

  const progressPercentage = ((student.totalDebt - student.remainingDebt) / student.totalDebt) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-teal-100">ID: {student.studentId} | {student.email}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-teal-800 p-2 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Deuda Total</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">S/. {student.totalDebt.toFixed(2)}</p>
            </div>

            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="font-semibold text-red-900">Monto Restante</h3>
              </div>
              <p className="text-2xl font-bold text-red-600">S/. {student.remainingDebt.toFixed(2)}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-green-900">Progreso</h3>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-green-600">{progressPercentage.toFixed(1)}% completado</p>
            </div>
          </div>

          {/* Loan Information */}
          <div className="bg-gray-50 rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Información del Préstamo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Fecha del Préstamo</p>
                <p className="font-medium">{new Date(student.loanDate).toLocaleDateString('es-ES')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Vencimiento</p>
                <p className="font-medium">{new Date(student.dueDate).toLocaleDateString('es-ES')}</p>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="mb-8">
            <StudentAICard student={student} />
          </div>

          {/* Payment History */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Historial de Pagos</h3>
            <div className="space-y-4">
              {student.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
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

                  {payment.date && (
                    <p className="text-sm text-green-600 mb-3">
                      Pagado el: {new Date(payment.date).toLocaleDateString('es-ES')}
                    </p>
                  )}

                  {/* Voucher Section */}
                  <div className="border-t border-gray-100 pt-3">
                    {payment.voucherUrl ? (
                      <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Boucher subido</span>
                          {payment.uploadedAt && (
                            <span className="text-xs text-green-600">
                              ({new Date(payment.uploadedAt).toLocaleDateString('es-ES')})
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </button>
                          <a
                            href={payment.voucherUrl}
                            download={`boucher-${payment.id}.jpg`}
                            className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Descargar
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Boucher de pago</span>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleVoucherUpload(payment.id, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploadingPaymentId === payment.id}
                          />
                          <button
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              uploadingPaymentId === payment.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                            }`}
                            disabled={uploadingPaymentId === payment.id}
                          >
                            <Upload className="w-4 h-4" />
                            {uploadingPaymentId === payment.id ? 'Subiendo...' : 'Subir Boucher'}
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
      </div>

      {/* Voucher Preview Modal */}
      {selectedPayment?.voucherUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-2xl p-4 max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Boucher de Pago - {selectedPayment.description}</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img
              src={selectedPayment.voucherUrl}
              alt="Boucher de pago"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};