import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, documentType, context = {} } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Document content is required' },
        { status: 400 }
      )
    }

    // Проверяем наличие валидного OpenAI API ключа
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key') {
      return getFallbackDocumentAnalysis(content, documentType)
    }

    const analysisPrompt = `Analyze the following ${documentType || 'document'} and provide comprehensive M&A insights:

Document Content:
${content}

Context: ${JSON.stringify(context)}

Please provide analysis in the following JSON format:
{
  "summary": "Brief summary of the document",
  "key_findings": ["finding1", "finding2", "finding3"],
  "risks": ["risk1", "risk2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "financial_metrics": {
    "revenue": "estimated value or range",
    "ebitda": "estimated value or range",
    "debt": "estimated value or range"
  },
  "legal_considerations": ["consideration1", "consideration2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "confidence_score": 85,
  "urgency_level": "high|medium|low",
  "deal_impact": "positive|negative|neutral"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert M&A document analyzer. Provide detailed analysis in JSON format only.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content

    if (response) {
      try {
        const analysis = JSON.parse(response)
        
        // Добавляем дополнительные метаданные
        const enhancedAnalysis = {
          ...analysis,
          metadata: {
            document_type: documentType || 'unknown',
            content_length: content.length,
            analysis_timestamp: new Date().toISOString(),
            model_used: 'gpt-3.5-turbo',
            tokens_used: completion.usage?.total_tokens || 0
          },
          extracted_data: extractStructuredData(content),
          sentiment_analysis: analyzeSentiment(content)
        }

        return NextResponse.json({
          success: true,
          analysis: enhancedAnalysis
        })
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        return getFallbackDocumentAnalysis(content, documentType)
      }
    }

    return getFallbackDocumentAnalysis(content, documentType)

  } catch (error) {
    console.error('Document Analysis Error:', error)
    return getFallbackDocumentAnalysis(content, documentType)
  }
}

function getFallbackDocumentAnalysis(content: string, documentType?: string) {
  const demoAnalysis = {
    summary: "Демо-анализ документа с ключевыми инсайтами для M&A сделки",
    key_findings: [
      "Документ содержит важную финансовую информацию",
      "Выявлены потенциальные синергии",
      "Необходима дополнительная due diligence"
    ],
    risks: [
      "Потенциальные правовые риски",
      "Финансовые обязательства требуют внимания"
    ],
    opportunities: [
      "Возможности для операционных синергий",
      "Потенциал роста стоимости"
    ],
    financial_metrics: {
      revenue: "5-10 млн USD",
      ebitda: "1-2 млн USD",
      debt: "2-3 млн USD"
    },
    legal_considerations: [
      "Требуется правовая экспертиза",
      "Проверка соответствия регулятивным требованиям"
    ],
    recommendations: [
      "Провести детальный финансовый анализ",
      "Организовать правовую due diligence"
    ],
    confidence_score: 75,
    urgency_level: "medium",
    deal_impact: "positive",
    metadata: {
      document_type: documentType || 'unknown',
      content_length: content.length,
      analysis_timestamp: new Date().toISOString(),
      model_used: 'demo-fallback',
      tokens_used: 0
    },
    extracted_data: extractStructuredData(content),
    sentiment_analysis: analyzeSentiment(content)
  }

  return NextResponse.json({
    success: true,
    analysis: demoAnalysis
  })
}

function extractStructuredData(content: string) {
  const data = {
    numbers: extractNumbers(content),
    dates: extractDates(content),
    companies: extractCompanies(content),
    currencies: extractCurrencies(content),
    percentages: extractPercentages(content)
  }
  
  return data
}

function extractNumbers(text: string): number[] {
  const numbers = text.match(/\d+(?:\.\d+)?/g) || []
  return numbers.map(n => parseFloat(n)).filter(n => !isNaN(n))
}

function extractDates(text: string): string[] {
  const datePatterns = [
    /\d{1,2}\/\d{1,2}\/\d{4}/g,
    /\d{4}-\d{2}-\d{2}/g,
    /\d{1,2}\.\d{1,2}\.\d{4}/g
  ]
  
  const dates: string[] = []
  datePatterns.forEach(pattern => {
    const matches = text.match(pattern) || []
    dates.push(...matches)
  })
  
  return dates
}

function extractCompanies(text: string): string[] {
  const companyPatterns = [
    /[A-Z][a-z]+ (?:Inc|Corp|LLC|Ltd|GmbH|SA|NV)/g,
    /ООО "[^"]+"/g,
    /АО "[^"]+"/g
  ]
  
  const companies: string[] = []
  companyPatterns.forEach(pattern => {
    const matches = text.match(pattern) || []
    companies.push(...matches)
  })
  
  return companies
}

function extractCurrencies(text: string): string[] {
  const currencyPatterns = [
    /\$\d+(?:\.\d+)?/g,
    /€\d+(?:\.\d+)?/g,
    /₽\d+(?:\.\d+)?/g,
    /\d+(?:\.\d+)? (?:USD|EUR|RUB|GBP)/g
  ]
  
  const currencies: string[] = []
  currencyPatterns.forEach(pattern => {
    const matches = text.match(pattern) || []
    currencies.push(...matches)
  })
  
  return currencies
}

function extractPercentages(text: string): string[] {
  const percentagePattern = /\d+(?:\.\d+)?%/g
  return text.match(percentagePattern) || []
}

function analyzeSentiment(text: string) {
  const positiveWords = /успех|рост|прибыль|выгода|возможность|потенциал|синергия/i
  const negativeWords = /риск|проблема|потеря|убыток|опасность|сложность|конфликт/i
  const neutralWords = /анализ|исследование|обзор|отчет|документ|информация/i
  
  const positiveCount = (text.match(positiveWords) || []).length
  const negativeCount = (text.match(negativeWords) || []).length
  const neutralCount = (text.match(neutralWords) || []).length
  
  let sentiment = 'neutral'
  if (positiveCount > negativeCount) sentiment = 'positive'
  else if (negativeCount > positiveCount) sentiment = 'negative'
  
  return {
    sentiment,
    scores: {
      positive: positiveCount,
      negative: negativeCount,
      neutral: neutralCount
    },
    confidence: Math.abs(positiveCount - negativeCount) / (positiveCount + negativeCount + neutralCount)
  }
} 