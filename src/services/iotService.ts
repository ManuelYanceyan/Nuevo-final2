interface GuaranteeEvaluation {
  id: string;
  studentId: string;
  guaranteeType: 'property' | 'vehicle' | 'jewelry' | 'electronics' | 'other';
  estimatedValue: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  creditRecommendation: number;
  riskLevel: 'low' | 'medium' | 'high';
  evaluationDate: string;
  iotDeviceId: string;
  images: string[];
  specifications: Record<string, any>;
  marketComparison: {
    averagePrice: number;
    priceRange: { min: number; max: number };
    marketTrend: 'rising' | 'stable' | 'declining';
  };
}

interface IoTDevice {
  id: string;
  type: 'scanner' | 'camera' | 'sensor' | 'analyzer';
  status: 'online' | 'offline' | 'busy';
  location: string;
  capabilities: string[];
}

interface CreditQuote {
  maxAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  guaranteeRequired: number;
  approvalProbability: number;
  conditions: string[];
}

class IoTService {
  private devices: IoTDevice[] = [
    {
      id: 'scanner-001',
      type: 'scanner',
      status: 'online',
      location: 'Oficina Principal',
      capabilities: ['document_scan', 'barcode_read', 'qr_scan']
    },
    {
      id: 'camera-002',
      type: 'camera',
      status: 'online',
      location: 'Sala de Evaluación',
      capabilities: ['high_res_photo', 'video_record', 'dimension_measure']
    },
    {
      id: 'analyzer-003',
      type: 'analyzer',
      status: 'online',
      location: 'Laboratorio',
      capabilities: ['material_analysis', 'authenticity_check', 'value_assessment']
    }
  ];

  private mockEvaluations: GuaranteeEvaluation[] = [
    {
      id: 'eval-001',
      studentId: '1',
      guaranteeType: 'vehicle',
      estimatedValue: 25000,
      condition: 'good',
      creditRecommendation: 18000,
      riskLevel: 'low',
      evaluationDate: '2025-01-15',
      iotDeviceId: 'analyzer-003',
      images: ['https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg'],
      specifications: {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        mileage: 45000,
        engine: '1.8L'
      },
      marketComparison: {
        averagePrice: 24500,
        priceRange: { min: 22000, max: 27000 },
        marketTrend: 'stable'
      }
    }
  ];

  // Get available IoT devices
  async getAvailableDevices(): Promise<IoTDevice[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.devices.filter(device => device.status === 'online');
  }

  // Start guarantee evaluation process
  async startGuaranteeEvaluation(
    studentId: string,
    guaranteeType: string,
    deviceId: string
  ): Promise<{ evaluationId: string; estimatedTime: number }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const evaluationId = `eval-${Date.now()}`;
    const estimatedTime = this.getEstimatedEvaluationTime(guaranteeType);

    // Update device status to busy
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      device.status = 'busy';
    }

    return { evaluationId, estimatedTime };
  }

  // Simulate IoT evaluation process
  async performEvaluation(
    evaluationId: string,
    studentId: string,
    guaranteeType: 'property' | 'vehicle' | 'jewelry' | 'electronics' | 'other',
    deviceId: string
  ): Promise<GuaranteeEvaluation> {
    // Simulate evaluation time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const baseValue = this.generateBaseValue(guaranteeType);
    const condition = this.simulateConditionAssessment();
    const marketData = this.simulateMarketAnalysis(guaranteeType, baseValue);
    
    const evaluation: GuaranteeEvaluation = {
      id: evaluationId,
      studentId,
      guaranteeType,
      estimatedValue: baseValue,
      condition,
      creditRecommendation: this.calculateCreditRecommendation(baseValue, condition),
      riskLevel: this.assessRiskLevel(condition, guaranteeType),
      evaluationDate: new Date().toISOString(),
      iotDeviceId: deviceId,
      images: this.generateMockImages(guaranteeType),
      specifications: this.generateSpecifications(guaranteeType),
      marketComparison: marketData
    };

    // Update device status back to online
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      device.status = 'online';
    }

    // Store evaluation
    this.mockEvaluations.push(evaluation);

    return evaluation;
  }

  // Generate credit quote based on evaluation
  async generateCreditQuote(
    studentId: string,
    requestedAmount: number,
    evaluation?: GuaranteeEvaluation
  ): Promise<CreditQuote> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    let maxAmount = 5000; // Default without guarantee
    let interestRate = 15; // Default rate
    let approvalProbability = 60;
    const conditions: string[] = [];

    if (evaluation) {
      maxAmount = evaluation.creditRecommendation;
      
      // Adjust interest rate based on risk
      switch (evaluation.riskLevel) {
        case 'low':
          interestRate = 8;
          approvalProbability = 95;
          break;
        case 'medium':
          interestRate = 12;
          approvalProbability = 80;
          break;
        case 'high':
          interestRate = 18;
          approvalProbability = 65;
          break;
      }

      conditions.push(`Garantía requerida: ${evaluation.guaranteeType}`);
      conditions.push(`Valor estimado de garantía: S/. ${evaluation.estimatedValue.toFixed(2)}`);
    } else {
      conditions.push('Sin garantía - Monto limitado');
      conditions.push('Evaluación de historial crediticio requerida');
    }

    const finalAmount = Math.min(requestedAmount, maxAmount);
    const termMonths = this.calculateOptimalTerm(finalAmount);
    const monthlyPayment = this.calculateMonthlyPayment(finalAmount, interestRate, termMonths);

    return {
      maxAmount: finalAmount,
      interestRate,
      termMonths,
      monthlyPayment,
      guaranteeRequired: evaluation ? evaluation.estimatedValue * 0.8 : 0,
      approvalProbability,
      conditions
    };
  }

  // Get evaluation by ID
  async getEvaluation(evaluationId: string): Promise<GuaranteeEvaluation | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
  return this.mockEvaluations.find(e => e.id === evaluationId) || null;
  }

  // Get evaluations for student
  async getStudentEvaluations(studentId: string): Promise<GuaranteeEvaluation[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
  return this.mockEvaluations.filter(e => e.studentId === studentId);
  }

  // Get all evaluations (for admin)
  async getAllEvaluations(): Promise<GuaranteeEvaluation[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.mockEvaluations];
  }

  // Private helper methods
  private getEstimatedEvaluationTime(guaranteeType: string): number {
    const times = {
      property: 15, // minutes
      vehicle: 10,
      jewelry: 8,
      electronics: 5,
      other: 12
    };
    return times[guaranteeType as keyof typeof times] || 10;
  }

  private generateBaseValue(guaranteeType: string): number {
    const ranges = {
      property: { min: 50000, max: 500000 },
      vehicle: { min: 15000, max: 80000 },
      jewelry: { min: 2000, max: 25000 },
      electronics: { min: 500, max: 8000 },
      other: { min: 1000, max: 15000 }
    };
    
    const range = ranges[guaranteeType as keyof typeof ranges] || ranges.other;
    return Math.floor(Math.random() * (range.max - range.min) + range.min);
  }

  private simulateConditionAssessment(): 'excellent' | 'good' | 'fair' | 'poor' {
    const conditions = ['excellent', 'good', 'fair', 'poor'] as const;
    const weights = [0.2, 0.4, 0.3, 0.1]; // Probability weights
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < conditions.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return conditions[i];
      }
    }
    return 'good';
  }

  private simulateMarketAnalysis(guaranteeType: string, baseValue: number) {
    const variance = 0.15; // 15% variance
    const min = baseValue * (1 - variance);
    const max = baseValue * (1 + variance);
    const trends = ['rising', 'stable', 'declining'] as const;
    
    return {
      averagePrice: baseValue * (0.95 + Math.random() * 0.1),
      priceRange: { min, max },
      marketTrend: trends[Math.floor(Math.random() * trends.length)]
    };
  }

  private calculateCreditRecommendation(value: number, condition: string): number {
    const conditionMultipliers = {
      excellent: 0.8,
      good: 0.7,
      fair: 0.6,
      poor: 0.4
    };
    
    return Math.floor(value * conditionMultipliers[condition as keyof typeof conditionMultipliers]);
  }

  private assessRiskLevel(condition: string, guaranteeType: string): 'low' | 'medium' | 'high' {
    if (condition === 'excellent' && ['property', 'vehicle'].includes(guaranteeType)) {
      return 'low';
    } else if (condition === 'poor' || guaranteeType === 'electronics') {
      return 'high';
    }
    return 'medium';
  }

  private generateMockImages(guaranteeType: string): string[] {
    const imageMap = {
      property: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
      vehicle: ['https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg'],
      jewelry: ['https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg'],
      electronics: ['https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'],
      other: ['https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg']
    };
    
    return imageMap[guaranteeType as keyof typeof imageMap] || imageMap.other;
  }

  private generateSpecifications(guaranteeType: string): Record<string, any> {
    const specs = {
      property: {
        area: `${Math.floor(Math.random() * 200 + 80)}m²`,
        rooms: Math.floor(Math.random() * 4 + 2),
        bathrooms: Math.floor(Math.random() * 3 + 1),
        parking: Math.random() > 0.5,
        age: `${Math.floor(Math.random() * 20 + 5)} años`
      },
      vehicle: {
        brand: ['Toyota', 'Honda', 'Nissan', 'Hyundai'][Math.floor(Math.random() * 4)],
        year: 2015 + Math.floor(Math.random() * 9),
        mileage: Math.floor(Math.random() * 100000 + 20000),
        fuel: ['Gasolina', 'Diésel', 'Híbrido'][Math.floor(Math.random() * 3)]
      },
      jewelry: {
        material: ['Oro', 'Plata', 'Platino'][Math.floor(Math.random() * 3)],
        weight: `${(Math.random() * 50 + 5).toFixed(1)}g`,
        purity: ['18k', '14k', '925'][Math.floor(Math.random() * 3)]
      },
      electronics: {
        brand: ['Apple', 'Samsung', 'Sony', 'LG'][Math.floor(Math.random() * 4)],
        model: `Modelo ${Math.floor(Math.random() * 100 + 1)}`,
        condition: 'Funcional'
      },
      other: {
        category: 'Artículo general',
        condition: 'Bueno'
      }
    };
    
    return specs[guaranteeType as keyof typeof specs] || specs.other;
  }

  private calculateOptimalTerm(amount: number): number {
    if (amount <= 5000) return 12;
    if (amount <= 15000) return 24;
    if (amount <= 30000) return 36;
    return 48;
  }

  private calculateMonthlyPayment(amount: number, annualRate: number, months: number): number {
    const monthlyRate = annualRate / 100 / 12;
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment * 100) / 100;
  }
}

export const iotService = new IoTService();
export type { GuaranteeEvaluation, IoTDevice, CreditQuote };