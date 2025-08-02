'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Upload, 
  Download, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Sparkles,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  BookOpen,
  MessageSquare,
  Zap,
  AlertTriangle
} from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import AIChatStats from '@/components/AIChatStats'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  attachments?: string[]
  analysis?: {
    type: 'risk' | 'opportunity' | 'recommendation' | 'insight'
    confidence: number
    impact: 'high' | 'medium' | 'low'
    sentiment?: 'positive' | 'neutral' | 'negative' | 'mixed'
    emotion?: 'confident' | 'cautious' | 'enthusiastic' | 'concerned' | 'neutral'
    specificity?: 'high' | 'medium' | 'low'
    urgency?: 'high' | 'medium' | 'low'
    key_topics?: string[]
    recommended_actions?: string[]
    risk_level?: 'low' | 'medium' | 'high'
    opportunity_score?: number
  }
  metadata?: {
    timestamp: string
    model: string
    tokens_used: number
    conversation_length: number
    fallback_reason?: string
  }
}

interface Document {
  id: string
  name: string
  type: 'contract' | 'financial' | 'legal' | 'market' | 'other'
  size: string
  uploadedAt: Date
  status: 'analyzed' | 'processing' | 'pending'
  insights: string[]
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Привет! Я ваш AI ассистент для анализа M&A сделок. Могу помочь с анализом документов, оценкой рисков, выявлением возможностей и стратегическими рекомендациями. С чем хотите работать сегодня?',
      timestamp: new Date(),
      analysis: {
        type: 'insight',
        confidence: 100,
        impact: 'low',
        sentiment: 'positive',
        emotion: 'enthusiastic'
      }
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    'Проанализируйте этот контракт на предмет потенциальных рисков',
    'Какие ключевые финансовые метрики следует учитывать?',
    'Выявите потенциальные синергии в этой сделке',
    'Оцените рыночные условия для этой отрасли',
    'Проверьте требования регулятивного соответствия',
    'Создайте чек-лист для due diligence'
  ]

  const documentTypes = [
    { type: 'contract', label: 'Контракты', icon: <FileText className="w-4 h-4" /> },
    { type: 'financial', label: 'Финансовые отчеты', icon: <TrendingUp className="w-4 h-4" /> },
    { type: 'legal', label: 'Юридические документы', icon: <AlertCircle className="w-4 h-4" /> },
    { type: 'market', label: 'Исследования рынка', icon: <Search className="w-4 h-4" /> },
    { type: 'other', label: 'Другое', icon: <BookOpen className="w-4 h-4" /> }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)
    setError(null)

    try {
      // Подготавливаем контекст на основе загруженных документов
      const context = {
        documents: documents.map(doc => ({
          name: doc.name,
          type: doc.type,
          insights: doc.insights
        })),
        selectedDocument: selectedDocument ? {
          name: selectedDocument.name,
          type: selectedDocument.type,
          insights: selectedDocument.insights
        } : null
      }

      // Подготавливаем историю сообщений для API
      const history = messages.slice(-10).map(msg => ({
        type: msg.type,
        content: msg.content
      }))

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          history,
          context
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
          analysis: data.analysis,
          metadata: data.metadata
        }
        setMessages(prev => [...prev, aiResponse])
      } else {
        throw new Error(data.error || 'Неизвестная ошибка')
      }

    } catch (error) {
      console.error('Error sending message:', error)
      setError(error instanceof Error ? error.message : 'Ошибка при отправке сообщения')
      
      // Добавляем сообщение об ошибке
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз или обратитесь к технической поддержке.',
        timestamp: new Date(),
        analysis: {
          type: 'insight',
          confidence: 0,
          impact: 'low',
          sentiment: 'negative',
          emotion: 'concerned'
        }
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "Based on my analysis of the provided information, I can identify several key areas that require attention. The financial metrics show strong growth potential, but there are some regulatory considerations to address.",
      "I've reviewed the contract terms and identified potential risks in sections 3.2 and 7.1. The liability clauses may need revision to better protect your interests.",
      "The market analysis indicates favorable conditions for this type of transaction. However, I recommend conducting additional due diligence on the competitive landscape.",
      "From a strategic perspective, this deal aligns well with your portfolio objectives. The synergy potential is estimated at 15-20% cost savings in the first 18 months.",
      "I've identified several red flags that require immediate attention. The financial projections appear overly optimistic, and there are concerns about the management team's track record.",
      "The regulatory compliance review shows that this transaction should proceed without major hurdles. All necessary approvals appear to be obtainable within the expected timeframe."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    // Simulate file upload and analysis
    setTimeout(() => {
      const newDocuments: Document[] = Array.from(files).map((file, index) => ({
        id: Date.now().toString() + index,
        name: file.name,
        type: 'other' as Document['type'],
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date(),
        status: 'analyzed',
        insights: [
          'Document contains financial projections for Q1-Q4 2024',
          'Identified 3 potential risk factors',
          'Market analysis shows positive trends'
        ]
      }))

      setDocuments(prev => [...prev, ...newDocuments])
      setIsUploading(false)

      // Auto-generate AI message about uploaded documents
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I've analyzed the uploaded documents. I found ${newDocuments.length} key insights and identified ${Math.floor(Math.random() * 5) + 2} areas that require your attention. Would you like me to provide a detailed analysis?`,
        timestamp: new Date(),
        analysis: {
          type: 'insight',
          confidence: 85,
          impact: 'medium'
        }
      }
      setMessages(prev => [...prev, aiMessage])
    }, 3000)
  }

  const handleFileUploadFromComponent = async (files: File[]) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      // Создаем FormData для загрузки файлов
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

      // Загружаем файлы на сервер
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error(`Ошибка загрузки файлов: ${uploadResponse.status}`)
      }

      const uploadData = await uploadResponse.json()

      // Создаем документы с полученными данными
      const newDocuments: Document[] = files.map((file, index) => ({
        id: Date.now().toString() + index,
        name: file.name,
        type: determineDocumentType(file.name),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date(),
        status: 'analyzed',
        insights: generateDocumentInsights(file)
      }))

      setDocuments(prev => [...prev, ...newDocuments])

      // Автоматически генерируем AI сообщение о загруженных документах
      const context = {
        documents: newDocuments.map(doc => ({
          name: doc.name,
          type: doc.type,
          insights: doc.insights
        }))
      }

      const aiResponse = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Я загрузил ${newDocuments.length} документов: ${files.map(f => f.name).join(', ')}. Пожалуйста, проанализируй их и дай краткий обзор ключевых моментов.`,
          history: [],
          context
        }),
      })

      if (aiResponse.ok) {
        const aiData = await aiResponse.json()
        if (aiData.success) {
          const aiMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: aiData.response,
            timestamp: new Date(),
            analysis: aiData.analysis,
            metadata: aiData.metadata
          }
          setMessages(prev => [...prev, aiMessage])
        }
      }

    } catch (error) {
      console.error('Error uploading files:', error)
      setError(error instanceof Error ? error.message : 'Ошибка при загрузке файлов')
      
      // Добавляем сообщение об ошибке
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Извините, произошла ошибка при загрузке и анализе документов. Пожалуйста, попробуйте еще раз.',
        timestamp: new Date(),
        analysis: {
          type: 'insight',
          confidence: 0,
          impact: 'low',
          sentiment: 'negative',
          emotion: 'concerned'
        }
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsUploading(false)
    }
  }

  const determineDocumentType = (fileName: string): Document['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (extension === 'pdf' && fileName.toLowerCase().includes('contract')) return 'contract'
    if (['xls', 'xlsx', 'csv'].includes(extension || '')) return 'financial'
    if (extension === 'pdf' && fileName.toLowerCase().includes('legal')) return 'legal'
    if (fileName.toLowerCase().includes('market')) return 'market'
    
    return 'other'
  }

  const generateDocumentInsights = (file: File): string[] => {
    const insights = [
      'Финансовые прогнозы на Q1-Q4 2024 выглядят стабильными',
      'Выявлено 2-3 потенциальных фактора риска',
      'Анализ рынка показывает положительные тенденции',
      'Юридические условия требуют дополнительной проверки',
      'Ключевые показатели соответствуют отраслевым стандартам',
      'Обнаружены возможности для оптимизации процессов',
      'EBITDA мультипликатор в пределах отраслевых норм',
      'Денежные потоки демонстрируют положительную динамику',
      'Структура капитала требует оптимизации',
      'Операционные показатели выше среднерыночных',
      'Выявлены потенциальные синергии в размере 15-20%',
      'Регулятивные риски оцениваются как низкие'
    ]
    
    // Возвращаем случайные 2-4 инсайта в зависимости от типа документа
    const documentType = determineDocumentType(file.name)
    let relevantInsights = insights
    
    if (documentType === 'financial') {
      relevantInsights = insights.filter(insight => 
        insight.includes('финанс') || insight.includes('EBITDA') || 
        insight.includes('денежный') || insight.includes('капитал')
      )
    } else if (documentType === 'legal') {
      relevantInsights = insights.filter(insight => 
        insight.includes('юридический') || insight.includes('регулятив') || 
        insight.includes('риск')
      )
    } else if (documentType === 'contract') {
      relevantInsights = insights.filter(insight => 
        insight.includes('условия') || insight.includes('риск') || 
        insight.includes('проверки')
      )
    }
    
    const shuffled = relevantInsights.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 2)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'risk': return <AlertCircle className="w-4 h-4 text-danger-600" />
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-success-600" />
      case 'recommendation': return <Lightbulb className="w-4 h-4 text-warning-600" />
      case 'insight': return <Sparkles className="w-4 h-4 text-primary-600" />
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Documents Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Статистика чата */}
            <AIChatStats messages={messages} />
            
                        {/* Панель документов */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                <button className="text-primary-600 hover:text-primary-700">
                  <Upload className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Area */}
              <div className="mb-6">
                <FileUpload
                  onFileUpload={handleFileUploadFromComponent}
                  acceptedTypes={['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt']}
                  maxSize={10}
                  multiple={true}
                  className=""
                />
              </div>

              {/* Document List */}
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedDocument?.id === doc.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size} • {doc.uploadedAt.toLocaleDateString()}</p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'analyzed' ? 'bg-success-100 text-success-800' :
                            doc.status === 'processing' ? 'bg-warning-100 text-warning-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {doc.status === 'analyzed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {doc.status === 'processing' && <Clock className="w-3 h-3 mr-1" />}
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="card h-[calc(100vh-8rem)] flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
                    <p className="text-sm text-gray-500">M&A Analysis & Insights</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' ? 'bg-primary-600' : 'bg-gray-200'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-gray-600" />
                            )}
                          </div>
                          
                          <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                            <div className={`inline-block p-4 rounded-lg ${
                              message.type === 'user' 
                                ? 'bg-primary-600 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                              
                              {message.analysis && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="space-y-2">
                                    {/* Основная информация об анализе */}
                                    <div className="flex items-center justify-between text-xs">
                                      <div className="flex items-center space-x-2">
                                        {getAnalysisIcon(message.analysis.type)}
                                        <span className="capitalize font-medium">{message.analysis.type}</span>
                                        {message.analysis.sentiment && (
                                          <span className={`px-2 py-1 rounded-full text-xs ${
                                            message.analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                                            message.analysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                          }`}>
                                            {message.analysis.sentiment}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-gray-600">Уверенность: {message.analysis.confidence}%</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                          message.analysis.impact === 'high' ? 'bg-red-100 text-red-800' :
                                          message.analysis.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-green-100 text-green-800'
                                        }`}>
                                          {message.analysis.impact} влияние
                                        </span>
                                      </div>
                                    </div>

                                    {/* Дополнительные метрики */}
                                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                                      {message.analysis.specificity && (
                                        <span>Специфичность: {message.analysis.specificity}</span>
                                      )}
                                      {message.analysis.urgency && (
                                        <span>Срочность: {message.analysis.urgency}</span>
                                      )}
                                      {message.analysis.risk_level && (
                                        <span>Риск: {message.analysis.risk_level}</span>
                                      )}
                                      {message.analysis.opportunity_score && (
                                        <span>Возможности: {message.analysis.opportunity_score}/100</span>
                                      )}
                                    </div>

                                    {/* Ключевые темы */}
                                    {message.analysis.key_topics && message.analysis.key_topics.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {message.analysis.key_topics.map((topic, index) => (
                                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {topic}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {/* Рекомендуемые действия */}
                                    {message.analysis.recommended_actions && message.analysis.recommended_actions.length > 0 && (
                                      <div className="bg-blue-50 p-2 rounded">
                                        <div className="text-xs font-medium text-blue-800 mb-1">Рекомендуемые действия:</div>
                                        <ul className="text-xs text-blue-700 space-y-1">
                                          {message.analysis.recommended_actions.map((action, index) => (
                                            <li key={index} className="flex items-center space-x-1">
                                              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                              <span>{action}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Метаданные */}
                              {message.metadata && (
                                <div className="mt-2 text-xs text-gray-500">
                                  <div className="flex items-center justify-between">
                                    <span>Модель: {message.metadata.model}</span>
                                    <span>Токены: {message.metadata.tokens_used}</span>
                                  </div>
                                  {message.metadata.fallback_reason && (
                                    <div className="mt-1 text-yellow-600">
                                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                                      {message.metadata.fallback_reason}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                              <span>{message.timestamp.toLocaleTimeString()}</span>
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => copyToClipboard(message.content)}
                                  className="hover:text-gray-700"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                                <button className="hover:text-gray-700">
                                  <ThumbsUp className="w-3 h-3" />
                                </button>
                                <button className="hover:text-gray-700">
                                  <ThumbsDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="p-4 border-t border-gray-200">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Quick prompts:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Ask me anything about M&A analysis, document review, or strategic insights..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}