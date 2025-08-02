import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history = [], context = {} } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Проверяем наличие валидного OpenAI API ключа
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key' || process.env.OPENAI_API_KEY === 'sk-823RU08kRLljzXtMtsF6S1ZPtE6RsSQy') {
      return getFallbackResponse(message, history)
    }

    // Build conversation history
    const messages = [
      {
        role: 'system' as const,
        content: `You are an expert M&A advisor and AI assistant with deep knowledge of:
- Mergers and acquisitions processes and best practices
- Financial analysis and valuation methodologies
- Legal and regulatory compliance in M&A transactions
- Market intelligence and competitive analysis
- Due diligence processes and risk assessment
- Deal structuring and negotiation strategies

You provide clear, actionable insights and recommendations. Always consider the context of the conversation and provide specific, relevant advice. If you need more information to provide a complete answer, ask clarifying questions.

Current context: ${JSON.stringify(context)}`
      },
      ...history.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    })

    const response = completion.choices[0]?.message?.content

    // Analyze the response to determine type and confidence
    const responseAnalysis = await analyzeResponse(response || '', message)

    return NextResponse.json({
      success: true,
      response,
      analysis: responseAnalysis,
      metadata: {
        timestamp: new Date().toISOString(),
        model: 'gpt-3.5-turbo',
        tokens_used: completion.usage?.total_tokens || 0,
        conversation_length: (history?.length || 0) + 2
      }
    })

  } catch (error) {
    console.error('AI Chat Error:', error)
    
    // Проверяем тип ошибки для более детальной информации
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    // Фоллбек на демо-ответы при ошибках OpenAI API
    return getFallbackResponse(message, history)
  }
}

function getFallbackResponse(message: string, history: any[] = []) {
  // Демо-ответы на русском языке для M&A консультаций
  const demoResponses = [
    "Понимаю ваш вопрос о M&A анализе. На основе моего опыта в сфере слияний и поглощений, рекомендую начать с тщательного анализа финансовых показателей целевой компании. Ключевые метрики включают EBITDA, денежные потоки и долговую нагрузку.",
    
    "Отличный вопрос! В контексте M&A транзакций важно учитывать не только финансовые аспекты, но и стратегические синергии. Рекомендую провести анализ: 1) Операционных синергий 2) Финансовых синергий 3) Рыночных возможностей.",
    
    "Для успешной M&A сделки критически важна качественная due diligence. Основные области для проверки: финансовая отчетность, правовые аспекты, операционная деятельность, технологии и интеллектуальная собственность, HR и корпоративная культура.",
    
    "Анализируя вашу ситуацию, вижу потенциал для создания значительной стоимости. Ключевые факторы успеха: 1) Правильная оценка стоимости 2) Структура сделки 3) План интеграции 4) Управление рисками. Готов детально обсудить каждый аспект.",
    
    "В текущих рыночных условиях особое внимание следует уделить ESG факторам и цифровой трансформации при оценке M&A возможностей. Компании с сильными ESG показателями и цифровыми активами показывают более высокие мультипликаторы оценки."
  ]
  
  const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]
  
  return NextResponse.json({
    success: true,
    response: randomResponse,
    analysis: {
      type: 'insight',
      confidence: 85,
      impact: 'medium',
      actionable: true
    },
    metadata: {
      timestamp: new Date().toISOString(),
      model: 'demo-fallback',
      tokens_used: 0,
      conversation_length: (history?.length || 0) + 2,
      fallback_reason: 'OpenAI API недоступен - используем демо-ответы'
    }
  })
}

async function analyzeResponse(response: string, userMessage: string) {
  try {
    const analysisPrompt = `Analyze the following AI response to a user query and provide comprehensive analysis:

User Query: "${userMessage}"
AI Response: "${response}"

Provide detailed analysis in the following JSON format:
{
  "type": "insight|recommendation|risk|opportunity|question|analysis",
  "confidence": 85,
  "impact": "high|medium|low",
  "actionable": true,
  "sentiment": "positive|neutral|negative|mixed",
  "emotion": "confident|cautious|enthusiastic|concerned|neutral",
  "specificity": "high|medium|low",
  "urgency": "high|medium|low",
  "key_topics": ["M&A", "valuation", "due diligence"],
  "recommended_actions": ["conduct financial analysis", "review legal documents"],
  "risk_level": "low|medium|high",
  "opportunity_score": 0-100
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert M&A response analyzer. Provide only valid JSON output with comprehensive analysis.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 500,
    })

    const analysisText = completion.choices[0]?.message?.content
    if (analysisText) {
      try {
        const parsedAnalysis = JSON.parse(analysisText)
        
        // Добавляем дополнительные вычисляемые поля
        return {
          ...parsedAnalysis,
          response_length: response.length,
          complexity_score: calculateComplexity(response),
          readability_score: calculateReadability(response),
          timestamp: new Date().toISOString(),
          analysis_version: '2.0'
        }
      } catch {
        // Fallback to enhanced default analysis
        return getEnhancedDefaultAnalysis(response, userMessage)
      }
    }

    return getEnhancedDefaultAnalysis(response, userMessage)

  } catch (error) {
    console.error('Response Analysis Error:', error)
    return getEnhancedDefaultAnalysis(response, userMessage)
  }
}

function calculateComplexity(text: string): number {
  const words = text.split(' ').length
  const sentences = text.split(/[.!?]+/).length
  const avgWordsPerSentence = words / sentences
  
  // Простая формула сложности на основе длины слов и предложений
  if (avgWordsPerSentence < 10) return 30
  if (avgWordsPerSentence < 15) return 60
  return 90
}

function calculateReadability(text: string): number {
  const words = text.split(' ').length
  const sentences = text.split(/[.!?]+/).length
  
  // Flesch Reading Ease (упрощенная версия)
  const avgWordsPerSentence = words / sentences
  const readability = 206.835 - (1.015 * avgWordsPerSentence)
  
  return Math.max(0, Math.min(100, readability))
}

function getEnhancedDefaultAnalysis(response: string, userMessage: string) {
  const hasRecommendations = /рекомендую|следует|нужно|важно/i.test(response)
  const hasRisks = /риск|опасность|проблема|сложность/i.test(response)
  const hasOpportunities = /возможность|потенциал|перспектива|выгода/i.test(response)
  
  let type = 'insight'
  if (hasRecommendations) type = 'recommendation'
  else if (hasRisks) type = 'risk'
  else if (hasOpportunities) type = 'opportunity'
  
  const sentiment = /отличный|успешный|эффективный|хороший/i.test(response) ? 'positive' : 
                   /проблема|риск|опасность|сложность/i.test(response) ? 'negative' : 'neutral'
  
  return {
    type,
    confidence: 75,
    impact: 'medium',
    actionable: hasRecommendations,
    sentiment,
    emotion: 'neutral',
    specificity: 'medium',
    urgency: 'medium',
    key_topics: extractTopics(response),
    recommended_actions: hasRecommendations ? ['review_documentation', 'conduct_analysis'] : [],
    risk_level: hasRisks ? 'medium' : 'low',
    opportunity_score: hasOpportunities ? 70 : 30,
    response_length: response.length,
    complexity_score: calculateComplexity(response),
    readability_score: calculateReadability(response),
    timestamp: new Date().toISOString(),
    analysis_version: '2.0'
  }
}

function extractTopics(text: string): string[] {
  const topics = []
  const topicKeywords = {
    'M&A': /M&A|слияние|поглощение|сделка/i,
    'valuation': /оценка|стоимость|мультипликатор|EBITDA/i,
    'due_diligence': /due diligence|проверка|анализ|документы/i,
    'financial': /финансовый|денежный поток|прибыль|доход/i,
    'legal': /правовой|юридический|закон|регулирование/i,
    'market': /рынок|конкуренция|тренд|анализ рынка/i
  }
  
  for (const [topic, regex] of Object.entries(topicKeywords)) {
    if (regex.test(text)) {
      topics.push(topic)
    }
  }
  
  return topics.length > 0 ? topics : ['general']
} 