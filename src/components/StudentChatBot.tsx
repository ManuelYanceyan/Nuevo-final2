import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';
import { Student } from '../types';
import { iotService, CreditQuote } from '../services/iotService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface StudentChatBotProps {
  student: Student;
}

export const StudentChatBot: React.FC<StudentChatBotProps> = ({ student }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `¡Hola ${student.name}! 👋 Soy tu asistente virtual. Puedo ayudarte con preguntas sobre tu cuenta, pagos, fechas de vencimiento y más. ¿En qué puedo ayudarte hoy?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();
    
    // Credit and loan queries
    if (message.includes('crédito') || message.includes('préstamo') || message.includes('solicitar')) {
      if (message.includes('cuánto') || message.includes('monto') || message.includes('cantidad')) {
        try {
          const quote = await iotService.generateCreditQuote(student.id, 10000);
          return `Basado en tu perfil, puedes acceder a:\n\n💰 Monto máximo: S/. ${quote.maxAmount.toFixed(2)}\n📊 Tasa de interés: ${quote.interestRate}% anual\n📅 Plazo: ${quote.termMonths} meses\n💳 Cuota mensual: S/. ${quote.monthlyPayment.toFixed(2)}\n\n¿Te interesa conocer más detalles sobre el proceso de solicitud?`;
        } catch (error) {
          return `Para obtener una cotización personalizada de crédito, necesitamos evaluar tu perfil. Puedes solicitar una evaluación en la oficina de administración. 🏢`;
        }
      }
      return `Ofrecemos diferentes tipos de crédito estudiantil:\n\n🎓 Crédito académico\n💻 Crédito para equipos\n📚 Crédito para materiales\n\nPara una cotización personalizada, pregúntame "¿cuánto crédito puedo obtener?" o visita nuestra oficina para una evaluación completa con garantías. 🏦`;
    }

    // Guarantee evaluation queries (and perform evaluation when requested)
    if (message.includes('garantía') || message.includes('aval') || message.includes('colateral')) {
      // If user explicitly asks to evaluate, run the IoT evaluation flow
      if (message.includes('evaluar') || message.includes('evaluación') || message.includes('evaluame') || message.includes('evaluarme')) {
        try {
          const devices = await iotService.getAvailableDevices();
          if (!devices || devices.length === 0) {
            return 'Actualmente no hay dispositivos IoT disponibles para realizar la evaluación. Por favor intenta más tarde o contacta a administración.';
          }

          // Infer guarantee type from message (basic heuristic)
          let guaranteeType: 'property' | 'vehicle' | 'jewelry' | 'electronics' | 'other' = 'other';
          if (message.includes('veh') || message.includes('auto') || message.includes('car')) guaranteeType = 'vehicle';
          else if (message.includes('prop') || message.includes('casa') || message.includes('inmueble')) guaranteeType = 'property';
          else if (message.includes('joy') || message.includes('anillo') || message.includes('joya')) guaranteeType = 'jewelry';
          else if (message.includes('elect') || message.includes('tel') || message.includes('laptop')) guaranteeType = 'electronics';

          const device = devices[0];

          // Start evaluation (simulated)
          const { evaluationId, estimatedTime } = await iotService.startGuaranteeEvaluation(student.id, guaranteeType, device.id);

          // Perform evaluation (simulated; may take a few seconds)
          const evaluation = await iotService.performEvaluation(evaluationId, student.id, guaranteeType, device.id);

          // Generate credit quote using the obtained evaluation
          const quote = await iotService.generateCreditQuote(student.id, 10000, evaluation);

          return `He evaluado tu garantía (${guaranteeType}) usando el dispositivo ${device.type} (${device.id}).\n\nValor estimado: S/. ${evaluation.estimatedValue.toFixed(2)}\nCondición: ${evaluation.condition}\n\nCotización resultante:\n💰 Monto máximo: S/. ${quote.maxAmount.toFixed(2)}\n📊 Tasa de interés: ${quote.interestRate}% anual\n📅 Plazo: ${quote.termMonths} meses\n💳 Cuota mensual: S/. ${quote.monthlyPayment.toFixed(2)}\n\n¿Quieres que inicie el proceso de solicitud de crédito?`;
        } catch (error) {
          return 'No fue posible realizar la evaluación en este momento. Por favor intenta nuevamente más tarde o contacta a administración.';
        }
      }

      return `Para evaluar garantías utilizamos tecnología IoT avanzada:\n\n🔍 Evaluación automática de valor\n📊 Análisis de mercado en tiempo real\n🤖 IA para determinar condición\n📱 Proceso rápido y preciso\n\nTipos de garantías aceptadas:\n🏠 Propiedades inmuebles\n🚗 Vehículos\n💎 Joyería\n💻 Electrónicos\n\nSi quieres que evaluemos tu garantía, pídele al asistente "evaluar mi garantía" o "evaluación" e indicar el tipo (ej: vehículo, propiedad).`;
    }
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Account balance and debt queries
    if (message.includes('saldo') || message.includes('deuda') || message.includes('debo')) {
      return `Tu saldo actual es de S/. ${student.remainingDebt.toFixed(2)} de un total de S/. ${student.totalDebt.toFixed(2)}. Has pagado S/. ${(student.totalDebt - student.remainingDebt).toFixed(2)} hasta ahora. 💰`;
    }

    // Payment status queries
    if (message.includes('pago') || message.includes('cuota')) {
      const pendingPayments = student.payments.filter(p => p.status === 'pending').length;
      const paidPayments = student.payments.filter(p => p.status === 'paid').length;
      return `Tienes ${paidPayments} pagos completados y ${pendingPayments} pagos pendientes. Tu estado actual es: ${student.status === 'active' ? 'Activo' : student.status === 'paid' ? 'Pagado completamente' : 'Vencido'}. 📊`;
    }

    // Due date queries
    if (message.includes('vencimiento') || message.includes('fecha') || message.includes('cuándo')) {
      const nextPayment = student.payments.find(p => p.status === 'pending');
      if (nextPayment) {
        return `Tu próximo pago vence el ${new Date(nextPayment.dueDate).toLocaleDateString('es-ES')} por un monto de S/. ${nextPayment.amount.toFixed(2)}. ¡No olvides realizar tu pago a tiempo! 📅`;
      }
      return `No tienes pagos pendientes en este momento. ¡Felicitaciones! 🎉`;
    }

    // Payment methods queries
    if (message.includes('cómo pagar') || message.includes('método') || message.includes('transferencia')) {
      return `Puedes realizar tus pagos mediante:\n\n💳 Transferencia bancaria\n🏦 Pago en ventanilla\n📱 Banca móvil\n💻 Plataforma web\n💰 Pago con crédito pre-aprobado\n\nRecuerda subir tu boucher de pago después de realizar la transferencia para que podamos verificar tu pago. 📄`;
    }

    // Voucher/receipt queries
    if (message.includes('boucher') || message.includes('comprobante') || message.includes('recibo')) {
      return `Para subir tu boucher de pago:\n\n1. Ve a tu historial de pagos 📋\n2. Busca el pago correspondiente\n3. Haz clic en "Subir Boucher" 📤\n4. Selecciona tu archivo (JPG, PNG o PDF)\n5. ¡Listo! Verificaremos tu pago pronto ✅`;
    }

    // Contact and support queries
    if (message.includes('contacto') || message.includes('ayuda') || message.includes('soporte')) {
      return `Si necesitas ayuda adicional, puedes contactarnos:\n\n📧 Email: cuentas@uncp.edu.pe\n📞 Teléfono: (064) 481-060\n🏢 Oficina: Administración - Ciudad Universitaria\n⏰ Horario: Lunes a Viernes 8:00 AM - 5:00 PM`;
    }

    // Account status queries
    if (message.includes('estado') || message.includes('situación')) {
      const statusText = student.status === 'active' ? 'activa y al día' : 
                        student.status === 'paid' ? 'completamente pagada' : 'con pagos vencidos';
      return `Tu cuenta está ${statusText}. ${student.status === 'overdue' ? 'Te recomendamos ponerte al día con tus pagos lo antes posible. 🚨' : student.status === 'paid' ? '¡Excelente trabajo! 🎉' : 'Mantén tus pagos al día. 👍'}`;
    }

    // Extension or payment plan queries
    if (message.includes('extensión') || message.includes('plan') || message.includes('facilidad')) {
      return `Si necesitas un plan de pagos o extensión:\n\n1. Contacta a la oficina de administración 📞\n2. Explica tu situación financiera 💬\n3. Presenta documentos de respaldo 📄\n4. Evaluaremos tu caso individualmente 🔍\n\nEstamos aquí para ayudarte a completar tus estudios. 🎓`;
    }

    // General greeting responses
    if (message.includes('hola') || message.includes('buenos') || message.includes('buenas')) {
      return `¡Hola ${student.name}! 😊 ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre tu saldo, pagos, fechas de vencimiento, métodos de pago y más.`;
    }

    // Thank you responses
    if (message.includes('gracias') || message.includes('thanks')) {
      return `¡De nada, ${student.name}! 😊 Estoy aquí para ayudarte siempre que lo necesites. ¿Hay algo más en lo que pueda asistirte?`;
    }

    // Default response with helpful suggestions
    return `Entiendo que tienes una consulta. Puedo ayudarte con:\n\n💰 Consultar tu saldo y deuda\n📅 Fechas de vencimiento\n💳 Métodos de pago\n📄 Subir bouchers\n📞 Información de contacto\n📊 Estado de tu cuenta\n\n¿Podrías ser más específico sobre lo que necesitas saber?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const botResponse = await generateBotResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error procesando tu mensaje. Por favor intenta nuevamente.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Asistente Virtual</h3>
              <p className="text-xs text-blue-100">Siempre aquí para ayudarte</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-all"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-teal-100 text-teal-600'
                    }`}>
                      {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};