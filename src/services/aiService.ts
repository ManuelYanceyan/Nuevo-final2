interface PaymentPrediction {
  likelihood: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendedAction: string;
  factors: string[];
}

interface DebtAnalysis {
  paymentCapacity: number;
  suggestedPaymentPlan: {
    amount: number;
    frequency: string;
    duration: string;
  };
  riskFactors: string[];
  recommendations: string[];
}

interface AIInsights {
  totalStudents: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  predictedCollections: number;
  recommendations: string[];
}

class AIService {
  private apiKey: string | null = null;

  constructor() {
    // In a real app, this would come from environment variables
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
  }

  // Simulate AI payment prediction based on student data
  async predictPaymentLikelihood(student: any): Promise<PaymentPrediction> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const paidPayments = student.payments.filter((p: any) => p.status === 'paid').length;
    const totalPayments = student.payments.length;
    const paymentRate = totalPayments > 0 ? paidPayments / totalPayments : 0;
    
    const daysOverdue = student.status === 'overdue' ? 
      Math.floor((new Date().getTime() - new Date(student.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    let likelihood = paymentRate * 0.6;
    
    // Adjust based on overdue status
    if (daysOverdue > 30) likelihood -= 0.3;
    else if (daysOverdue > 15) likelihood -= 0.2;
    else if (daysOverdue > 0) likelihood -= 0.1;
    
    // Adjust based on remaining debt ratio
    const debtRatio = student.remainingDebt / student.totalDebt;
    if (debtRatio < 0.3) likelihood += 0.2;
    else if (debtRatio > 0.8) likelihood -= 0.1;

    likelihood = Math.max(0, Math.min(1, likelihood));

    const riskLevel: 'low' | 'medium' | 'high' = 
      likelihood > 0.7 ? 'low' : 
      likelihood > 0.4 ? 'medium' : 'high';

    const factors = [];
    if (paymentRate > 0.8) factors.push('Historial de pagos excelente');
    if (paymentRate < 0.5) factors.push('Historial de pagos irregular');
    if (daysOverdue > 0) factors.push(`${daysOverdue} días de retraso`);
    if (debtRatio < 0.5) factors.push('Más del 50% de la deuda pagada');

    const recommendedAction = 
      riskLevel === 'low' ? 'Continuar monitoreo regular' :
      riskLevel === 'medium' ? 'Enviar recordatorio de pago' :
      'Contactar inmediatamente para plan de pago';

    return {
      likelihood: Math.round(likelihood * 100),
      riskLevel,
      recommendedAction,
      factors
    };
  }

  // Analyze debt and suggest payment plans
  async analyzeDebt(student: any): Promise<DebtAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const monthlyCapacity = student.remainingDebt / 6; // Assume 6 months capacity
    const riskFactors = [];
    const recommendations = [];

    if (student.status === 'overdue') {
      riskFactors.push('Pagos vencidos');
      recommendations.push('Establecer plan de pagos inmediato');
    }

    if (student.remainingDebt > 2000) {
      riskFactors.push('Deuda alta');
      recommendations.push('Considerar pagos fraccionados');
    }

    const paidOnTime = student.payments.filter((p: any) => 
      p.status === 'paid' && new Date(p.date) <= new Date(p.dueDate)
    ).length;

    if (paidOnTime / student.payments.length < 0.7) {
      riskFactors.push('Historial de pagos tardíos');
      recommendations.push('Configurar recordatorios automáticos');
    }

    return {
      paymentCapacity: Math.round(monthlyCapacity),
      suggestedPaymentPlan: {
        amount: Math.round(monthlyCapacity),
        frequency: 'mensual',
        duration: '6 meses'
      },
      riskFactors,
      recommendations
    };
  }

  // Generate insights for admin dashboard
  async generateInsights(students: any[]): Promise<AIInsights> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const predictions = await Promise.all(
      students.map(student => this.predictPaymentLikelihood(student))
    );

    const riskDistribution = predictions.reduce(
      (acc, pred) => {
        acc[pred.riskLevel]++;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );

    const predictedCollections = students.reduce((sum, student, index) => {
      const prediction = predictions[index];
      return sum + (student.remainingDebt * (prediction.likelihood / 100));
    }, 0);

    const recommendations = [];
    
    if (riskDistribution.high > students.length * 0.3) {
      recommendations.push('Alto número de estudiantes en riesgo - implementar programa de apoyo');
    }
    
    if (predictedCollections < students.reduce((sum, s) => sum + s.remainingDebt, 0) * 0.7) {
      recommendations.push('Baja probabilidad de cobro - revisar políticas de crédito');
    }

    recommendations.push('Implementar recordatorios automáticos para pagos próximos a vencer');
    recommendations.push('Ofrecer descuentos por pago anticipado');

    return {
      totalStudents: students.length,
      riskDistribution,
      predictedCollections: Math.round(predictedCollections),
      recommendations
    };
  }

  // Generate personalized message for student
  async generatePersonalizedMessage(student: any): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const prediction = await this.predictPaymentLikelihood(student);
    
    if (student.status === 'paid') {
      return `¡Felicitaciones ${student.name}! Has completado todos tus pagos exitosamente. 🎉`;
    }

    if (student.status === 'overdue') {
      return `Hola ${student.name}, notamos que tienes pagos vencidos. Te recomendamos contactar a administración para establecer un plan de pagos que se ajuste a tu situación. 📞`;
    }

    if (prediction.riskLevel === 'low') {
      return `¡Excelente trabajo ${student.name}! Mantienes un buen historial de pagos. Tu próximo pago vence el ${new Date(student.dueDate).toLocaleDateString('es-ES')}. 👍`;
    }

    return `Hola ${student.name}, te recordamos que tienes un saldo pendiente de S/. ${student.remainingDebt.toFixed(2)}. ¿Necesitas ayuda para planificar tus pagos? 💡`;
  }
}

export const aiService = new AIService();