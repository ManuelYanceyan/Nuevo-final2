import React, { useState, useEffect } from 'react';
import { Scan, Camera, Zap, Clock, CheckCircle, AlertTriangle, Eye, TrendingUp } from 'lucide-react';
import { iotService, GuaranteeEvaluation, IoTDevice } from '../services/iotService';

interface GuaranteeEvaluationPanelProps {
  onEvaluationComplete?: (evaluation: GuaranteeEvaluation) => void;
}

export const GuaranteeEvaluationPanel: React.FC<GuaranteeEvaluationPanelProps> = ({
  onEvaluationComplete
}) => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [evaluations, setEvaluations] = useState<GuaranteeEvaluation[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [guaranteeType, setGuaranteeType] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<string | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<GuaranteeEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [devicesData, evaluationsData] = await Promise.all([
        iotService.getAvailableDevices(),
        iotService.getAllEvaluations()
      ]);
      setDevices(devicesData);
      setEvaluations(evaluationsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEvaluation = async () => {
    if (!selectedDevice || !guaranteeType || !studentId) return;

    setIsEvaluating(true);
    try {
      const { evaluationId, estimatedTime } = await iotService.startGuaranteeEvaluation(
        studentId,
        guaranteeType,
        selectedDevice
      );

      setCurrentEvaluation(evaluationId);

      // Simulate evaluation process
      const evaluation = await iotService.performEvaluation(
        evaluationId,
        studentId,
        guaranteeType as any,
        selectedDevice
      );

      setEvaluations(prev => [...prev, evaluation]);
      setCurrentEvaluation(null);
      
      if (onEvaluationComplete) {
        onEvaluationComplete(evaluation);
      }

      // Reset form
      setStudentId('');
      setGuaranteeType('');
      setSelectedDevice('');
    } catch (error) {
      console.error('Error during evaluation:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'scanner':
        return <Scan className="w-5 h-5" />;
      case 'camera':
        return <Camera className="w-5 h-5" />;
      case 'analyzer':
        return <Zap className="w-5 h-5" />;
      default:
        return <Scan className="w-5 h-5" />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Evaluation Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
            <Scan className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Evaluación de Garantías IoT</h2>
            <p className="text-gray-600">Sistema inteligente de valoración de garantías</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID del Estudiante
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: 2021200001"
              disabled={isEvaluating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Garantía
            </label>
            <select
              value={guaranteeType}
              onChange={(e) => setGuaranteeType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isEvaluating}
            >
              <option value="">Seleccionar tipo</option>
              <option value="property">Propiedad Inmueble</option>
              <option value="vehicle">Vehículo</option>
              <option value="jewelry">Joyería</option>
              <option value="electronics">Electrónicos</option>
              <option value="other">Otros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dispositivo IoT
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isEvaluating}
            >
              <option value="">Seleccionar dispositivo</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.type.toUpperCase()} - {device.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Device Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedDevice === device.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {getDeviceIcon(device.type)}
                <div>
                  <h4 className="font-semibold text-gray-900">{device.type.toUpperCase()}</h4>
                  <p className="text-sm text-gray-600">{device.location}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  device.status === 'online' ? 'bg-green-100 text-green-800' :
                  device.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {device.status}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Capacidades: {device.capabilities.join(', ')}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleStartEvaluation}
          disabled={!selectedDevice || !guaranteeType || !studentId || isEvaluating}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-all"
        >
          {isEvaluating ? (
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 animate-spin" />
              Evaluando Garantía...
            </div>
          ) : (
            'Iniciar Evaluación IoT'
          )}
        </button>
      </div>

      {/* Evaluations History */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Historial de Evaluaciones</h3>
        
        {evaluations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Scan className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay evaluaciones registradas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {evaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      {getDeviceIcon('analyzer')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {evaluation.guaranteeType.charAt(0).toUpperCase() + evaluation.guaranteeType.slice(1)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Estudiante: {evaluation.studentId} | {new Date(evaluation.evaluationDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvaluation(evaluation)}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Valor Estimado</p>
                    <p className="font-semibold text-gray-900">S/. {evaluation.estimatedValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Crédito Recomendado</p>
                    <p className="font-semibold text-green-600">S/. {evaluation.creditRecommendation.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Condición</p>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border inline-block ${getConditionColor(evaluation.condition)}`}>
                      {evaluation.condition}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">Riesgo</p>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border inline-block ${getRiskColor(evaluation.riskLevel)}`}>
                      {evaluation.riskLevel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evaluation Detail Modal */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Detalle de Evaluación</h2>
                  <p className="text-purple-100">ID: {selectedEvaluation.id}</p>
                </div>
                <button
                  onClick={() => setSelectedEvaluation(null)}
                  className="text-white hover:bg-purple-700 p-2 rounded-lg transition-all"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Información General</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estudiante:</span>
                        <span className="font-medium">{selectedEvaluation.studentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo:</span>
                        <span className="font-medium">{selectedEvaluation.guaranteeType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium">{new Date(selectedEvaluation.evaluationDate).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dispositivo:</span>
                        <span className="font-medium">{selectedEvaluation.iotDeviceId}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Valoración</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor Estimado:</span>
                        <span className="font-bold text-blue-600">S/. {selectedEvaluation.estimatedValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crédito Recomendado:</span>
                        <span className="font-bold text-green-600">S/. {selectedEvaluation.creditRecommendation.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condición:</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getConditionColor(selectedEvaluation.condition)}`}>
                          {selectedEvaluation.condition}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nivel de Riesgo:</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(selectedEvaluation.riskLevel)}`}>
                          {selectedEvaluation.riskLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Análisis de Mercado</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Comparación de Mercado</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Precio Promedio:</span>
                          <span className="font-medium">S/. {selectedEvaluation.marketComparison.averagePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rango de Precios:</span>
                          <span className="font-medium">
                            S/. {selectedEvaluation.marketComparison.priceRange.min.toFixed(2)} - 
                            S/. {selectedEvaluation.marketComparison.priceRange.max.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tendencia:</span>
                          <span className={`font-medium ${
                            selectedEvaluation.marketComparison.marketTrend === 'rising' ? 'text-green-600' :
                            selectedEvaluation.marketComparison.marketTrend === 'declining' ? 'text-red-600' :
                            'text-blue-600'
                          }`}>
                            {selectedEvaluation.marketComparison.marketTrend === 'rising' ? 'Al alza' :
                             selectedEvaluation.marketComparison.marketTrend === 'declining' ? 'A la baja' : 'Estable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Especificaciones</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        {Object.entries(selectedEvaluation.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              {selectedEvaluation.images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Imágenes de Evaluación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEvaluation.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Evaluación ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};