import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Users, Target, Lightbulb, BarChart3 } from 'lucide-react';
import { Student } from '../types';
import { aiService } from '../services/aiService';

interface AIInsightsPanelProps {
  students: Student[];
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

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ students }) => {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      setLoading(true);
      try {
        const aiInsights = await aiService.generateInsights(students);
        setInsights(aiInsights);
      } catch (error) {
        console.error('Error generating AI insights:', error);
      } finally {
        setLoading(false);
      }
    };

    if (students.length > 0) {
      generateInsights();
    }
  }, [students]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Análisis IA</h2>
            <p className="text-gray-600">Generando insights inteligentes...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  const totalDebt = students.reduce((sum, student) => sum + student.remainingDebt, 0);
  const collectionRate = totalDebt > 0 ? (insights.predictedCollections / totalDebt) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Análisis IA</h2>
          <p className="text-gray-600">Insights inteligentes sobre tu cartera</p>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Bajo Riesgo</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{insights.riskDistribution.low}</p>
          <p className="text-sm text-green-700">estudiantes</p>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">Riesgo Medio</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{insights.riskDistribution.medium}</p>
          <p className="text-sm text-yellow-700">estudiantes</p>
        </div>

        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Alto Riesgo</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{insights.riskDistribution.high}</p>
          <p className="text-sm text-red-700">estudiantes</p>
        </div>
      </div>

      {/* Collection Prediction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Predicción de Cobro</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-700 mb-1">Monto Predicho</p>
            <p className="text-2xl font-bold text-blue-600">S/. {insights.predictedCollections.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-blue-700 mb-1">Tasa de Cobro Esperada</p>
            <p className="text-2xl font-bold text-blue-600">{collectionRate.toFixed(1)}%</p>
          </div>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2 mt-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(collectionRate, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-900">Recomendaciones IA</h3>
        </div>
        <div className="space-y-3">
          {insights.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-100">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-purple-600">{index + 1}</span>
              </div>
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};