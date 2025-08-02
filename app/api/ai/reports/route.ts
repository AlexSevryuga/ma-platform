import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      reportType, 
      dealData, 
      analysisData, 
      predictionData, 
      format = 'markdown',
      language = 'ru'
    } = body

    if (!reportType || !dealData) {
      return NextResponse.json(
        { error: 'Report type and deal data are required' },
        { status: 400 }
      )
    }

    // Проверяем наличие валидного OpenAI API ключа
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key') {
      return getFallbackReport(reportType, dealData, analysisData, predictionData, format, language)
    }

    const reportPrompt = generateReportPrompt(reportType, dealData, analysisData, predictionData, format, language)

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert M&A report writer. Generate professional, comprehensive reports in ${language} language. Use ${format} format. Include executive summary, detailed analysis, and actionable recommendations.`
        },
        {
          role: 'user',
          content: reportPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content

    if (response) {
      const report = {
        content: response,
        metadata: {
          report_type: reportType,
          format,
          language,
          generated_at: new Date().toISOString(),
          model_used: 'gpt-3.5-turbo',
          tokens_used: completion.usage?.total_tokens || 0,
          deal_id: dealData.id || 'unknown'
        },
        sections: extractReportSections(response, format),
        summary: generateExecutiveSummary(response, language)
      }

      return NextResponse.json({
        success: true,
        report
      })
    }

    return getFallbackReport(reportType, dealData, analysisData, predictionData, format, language)

  } catch (error) {
    console.error('Report Generation Error:', error)
    return getFallbackReport(reportType, dealData, analysisData, predictionData, format, language)
  }
}

function generateReportPrompt(reportType: string, dealData: any, analysisData: any, predictionData: any, format: string, language: string) {
  const basePrompt = `Generate a comprehensive ${reportType} report for the following M&A deal:

Deal Information:
${JSON.stringify(dealData, null, 2)}

Analysis Data:
${JSON.stringify(analysisData, null, 2)}

Prediction Data:
${JSON.stringify(predictionData, null, 2)}

Requirements:
- Language: ${language}
- Format: ${format}
- Include executive summary
- Provide detailed analysis
- Include actionable recommendations
- Use professional business language
- Include relevant metrics and KPIs
- Structure with clear sections and subsections

Please generate a complete, professional report.`

  switch (reportType) {
    case 'due_diligence':
      return `${basePrompt}

Focus on:
- Financial analysis and valuation
- Legal and regulatory compliance
- Operational assessment
- Risk identification and mitigation
- Integration planning
- Strategic fit analysis`
    
    case 'investment_memo':
      return `${basePrompt}

Focus on:
- Investment thesis
- Market opportunity
- Competitive landscape
- Financial projections
- Risk assessment
- Exit strategy
- Investment recommendation`
    
    case 'synergy_analysis':
      return `${basePrompt}

Focus on:
- Cost synergies identification
- Revenue synergies potential
- Integration challenges
- Synergy realization timeline
- Synergy value quantification
- Implementation roadmap`
    
    case 'risk_assessment':
      return `${basePrompt}

Focus on:
- Financial risks
- Operational risks
- Legal and regulatory risks
- Market risks
- Integration risks
- Risk mitigation strategies
- Risk monitoring framework`
    
    case 'valuation_report':
      return `${basePrompt}

Focus on:
- Valuation methodology
- Financial analysis
- Comparable transactions
- Discounted cash flow analysis
- Sensitivity analysis
- Valuation conclusion
- Key assumptions`
    
    default:
      return basePrompt
  }
}

function getFallbackReport(reportType: string, dealData: any, analysisData: any, predictionData: any, format: string, language: string) {
  const demoReport = generateDemoReport(reportType, dealData, analysisData, predictionData, format, language)
  
  return NextResponse.json({
    success: true,
    report: {
      content: demoReport,
      metadata: {
        report_type: reportType,
        format,
        language,
        generated_at: new Date().toISOString(),
        model_used: 'demo-fallback',
        tokens_used: 0,
        deal_id: dealData.id || 'unknown'
      },
      sections: extractReportSections(demoReport, format),
      summary: generateExecutiveSummary(demoReport, language)
    }
  })
}

function generateDemoReport(reportType: string, dealData: any, analysisData: any, predictionData: any, format: string, language: string) {
  const reportTemplates = {
    due_diligence: `# Отчет о Due Diligence

## Исполнительное резюме
Проведен комплексный анализ целевой компании в рамках M&A сделки. Выявлены ключевые риски и возможности для создания стоимости.

## Финансовый анализ
- Выручка: ${dealData.revenue || '5-10 млн USD'}
- EBITDA: ${dealData.ebitda || '1-2 млн USD'}
- Долговая нагрузка: ${dealData.debt || '2-3 млн USD'}

## Правовой анализ
- Корпоративная структура: Стандартная
- Регулятивные риски: Низкие
- Требуется правовая экспертиза

## Операционный анализ
- Бизнес-процессы: Эффективные
- Технологическая платформа: Современная
- Персонал: Квалифицированный

## Рекомендации
1. Провести детальную финансовую экспертизу
2. Организовать правовую due diligence
3. Разработать план интеграции`,

    investment_memo: `# Инвестиционный меморандум

## Инвестиционный тезис
Предлагаемая сделка представляет привлекательную возможность для создания стоимости через синергии и операционные улучшения.

## Рыночная возможность
- Размер рынка: Растущий сегмент
- Конкурентная среда: Умеренная конкуренция
- Тренды: Положительные

## Финансовые проекции
- Прогноз выручки: Рост 15-20% в год
- EBITDA margin: 20-25%
- ROI: 25-30%

## Риски
- Интеграционные риски: Средние
- Рыночные риски: Низкие
- Регулятивные риски: Минимальные

## Рекомендация
Рекомендуем одобрить сделку при условии выполнения due diligence.`,

    synergy_analysis: `# Анализ синергий

## Исполнительное резюме
Выявлен потенциал создания стоимости через операционные и финансовые синергии.

## Операционные синергии
- Снижение затрат: 15-20%
- Оптимизация процессов: 10-15%
- Экономия на масштабе: 5-10%

## Финансовые синергии
- Улучшение денежных потоков
- Оптимизация капитальной структуры
- Снижение стоимости капитала

## Потенциал создания стоимости
- Общая стоимость синергий: 2-3 млн USD
- Срок реализации: 18-24 месяца
- Вероятность успеха: 75%`,

    risk_assessment: `# Оценка рисков

## Исполнительное резюме
Проведена комплексная оценка рисков M&A сделки.

## Финансовые риски
- Уровень: Средний
- Меры по снижению: Детальный финансовый анализ

## Операционные риски
- Уровень: Низкий
- Меры по снижению: План интеграции

## Правовые риски
- Уровень: Низкий
- Меры по снижению: Правовая экспертиза

## Рыночные риски
- Уровень: Средний
- Меры по снижению: Мониторинг рынка

## Общий уровень риска: Средний`,

    valuation_report: `# Отчет об оценке

## Методология оценки
Использованы методы: DCF, Comparable Companies, Comparable Transactions.

## Финансовый анализ
- Выручка: ${dealData.revenue || '5-10 млн USD'}
- EBITDA: ${dealData.ebitda || '1-2 млн USD'}
- Рост: 10-15% в год

## Оценка стоимости
- Диапазон: ${predictionData?.valuation_range?.min || 1000000} - ${predictionData?.valuation_range?.max || 5000000} USD
- Рекомендуемая цена: ${predictionData?.valuation_range?.min ? (predictionData.valuation_range.min + predictionData.valuation_range.max) / 2 : 3000000} USD

## Ключевые допущения
- Стабильный рост рынка
- Сохранение операционной эффективности
- Успешная интеграция

## Заключение
Рекомендуемая оценка обоснована и соответствует рыночным показателям.`
  }

  return reportTemplates[reportType as keyof typeof reportTemplates] || reportTemplates.due_diligence
}

function extractReportSections(content: string, format: string) {
  const sections: { [key: string]: string } = {}
  
  if (format === 'markdown') {
    const lines = content.split('\n')
    let currentSection = ''
    let currentContent = ''
    
    for (const line of lines) {
      if (line.startsWith('#')) {
        if (currentSection) {
          sections[currentSection] = currentContent.trim()
        }
        currentSection = line.replace(/^#+\s*/, '').trim()
        currentContent = ''
      } else {
        currentContent += line + '\n'
      }
    }
    
    if (currentSection) {
      sections[currentSection] = currentContent.trim()
    }
  }
  
  return sections
}

function generateExecutiveSummary(content: string, language: string) {
  // Простое извлечение исполнительного резюме
  const lines = content.split('\n')
  let summary = ''
  let inSummary = false
  
  for (const line of lines) {
    if (line.toLowerCase().includes('исполнительное резюме') || 
        line.toLowerCase().includes('executive summary')) {
      inSummary = true
      continue
    }
    
    if (inSummary && line.startsWith('#')) {
      break
    }
    
    if (inSummary) {
      summary += line + '\n'
    }
  }
  
  return summary.trim() || 'Исполнительное резюме будет сгенерировано автоматически.'
} 