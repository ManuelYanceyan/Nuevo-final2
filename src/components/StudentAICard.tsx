import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
import { Student } from '../types';
import { aiService } from '../services/aiService';

interface StudentAICardProps {
  student: Student;
}

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

export const StudentAICard: React.FC<StudentAICardProps> = ({ student }) => {
  const [prediction, setPrediction] = useState<PaymentPrediction | null>(null);
  const [analysis, setAnalysis] = useState<DebtAnalysis | null>(null);
  const [personalizedMessage, setPersonalizedMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateAIData = async () => {
      setLoading(true);
      try {
        const [predictionData, analysisData, message] = await Promise.all([
          aiService.predictPaymentLikelihood(student),
          aiService.analyzeDebt(student),
          aiService.generatePersonalizedMessage(student)
        ]);
        
        setPrediction(predictionData);
        setAnalysis(analysisData);
        setPersonalizedMessage(message);
      } catch (error) {
        console.error('Error generating AI data:', error);
      } finally {
        setLoading(false);
      }
    };

    generateAIData();
  }, [student]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">Análisis IA</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!prediction || !analysis) return null;

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Análisis IA</h3>
      </div>

      {/* Personalized Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-800">{personalizedMessage}</p>
        </div>
      </div>

      {/* Payment Prediction */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Predicción de Pago</h4>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(prediction.riskLevel)}`}>
            <div className="flex items-center gap-1">
              {getRiskIcon(prediction.riskLevel)}
              {prediction.riskLevel === 'low' ? 'Bajo Riesgo' :
               prediction.riskLevel === 'medium' ? 'Riesgo Medio' : 'Alto Riesgo'}
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Probabilidad de pago</span>
            <span className="font-medium">{prediction.likelihood}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                prediction.likelihood > 70 ? 'bg-green-500' :
                prediction.likelihood > 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${prediction.likelihood}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Acción Recomendada:</p>
          <p className="text-sm text-gray-600">{prediction.recommendedAction}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Factores Considerados:</p>
          <div className="space-y-1">
            {prediction.factors.map((factor, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <p className="text-xs text-gray-600">{factor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Debt Analysis */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Análisis de Deuda</h4>
        
        <div className="bg-teal-50 rounded-lg p-4 mb-4 border border-teal-200">
          <h5 className="font-medium text-teal-900 mb-2">Plan de Pago Sugerido</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-teal-700">Monto:</p>
              <p className="font-medium text-teal-900">S/. {analysis.suggestedPaymentPlan.amount}</p>
            </div>
            <div>
              <p className="text-teal-700">Frecuencia:</p>
              <p className="font-medium text-teal-900">{analysis.suggestedPaymentPlan.frequency}</p>
            </div>
          </div>
        </div>

        {analysis.riskFactors.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Factores de Riesgo:</p>
            <div className="space-y-1">
              {analysis.riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <p className="text-xs text-red-600">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Recomendaciones:</p>
          <div className="space-y-1">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                </div>
                <p className="text-xs text-gray-600">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};