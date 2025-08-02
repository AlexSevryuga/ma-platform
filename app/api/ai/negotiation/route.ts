import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      negotiationType, 
      dealData, 
      counterpartyInfo, 
      currentStage, 
      objectives = [],
      constraints = []
    } = body

    if (!negotiationType || !dealData) {
      return NextResponse.json(
        { error: 'Negotiation type and deal data are required' },
        { status: 400 }
      )
    }

    // Проверяем наличие валидного OpenAI API ключа
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key') {
      return getFallbackNegotiation(negotiationType, dealData, counterpartyInfo, currentStage, objectives, constraints)
    }

    const negotiationPrompt = generateNegotiationPrompt(negotiationType, dealData, counterpartyInfo, currentStage, objectives, constraints)

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert M&A negotiation strategist with decades of experience in complex deal negotiations. Provide strategic advice, tactics, and recommendations for successful deal execution.'
        },
        {
          role: 'user',
          content: negotiationPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content

    if (response) {
      try {
        const negotiation = JSON.parse(response)
        
        const enhancedNegotiation = {
          ...negotiation,
          metadata: {
            negotiation_type: negotiationType,
            current_stage,
            deal_value: dealData.value || 'unknown',
            created_at: new Date().toISOString(),
            model_used: 'gpt-3.5-turbo',
            tokens_used: completion.usage?.total_tokens || 0
          },
          ai_insights: generateNegotiationInsights(negotiationType, dealData, counterpartyInfo),
          risk_assessment: assessNegotiationRisks(dealData, counterpartyInfo),
          success_probability: calculateSuccessProbability(dealData, counterpartyInfo, objectives)
        }

        return NextResponse.json({
          success: true,
          negotiation: enhancedNegotiation
        })
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        return getFallbackNegotiation(negotiationType, dealData, counterpartyInfo, currentStage, objectives, constraints)
      }
    }

    return getFallbackNegotiation(negotiationType, dealData, counterpartyInfo, currentStage, objectives, constraints)

  } catch (error) {
    console.error('Negotiation Error:', error)
    return getFallbackNegotiation(negotiationType, dealData, counterpartyInfo, currentStage, objectives, constraints)
  }
}

function generateNegotiationPrompt(negotiationType: string, dealData: any, counterpartyInfo: any, currentStage: string, objectives: string[], constraints: string[]) {
  const basePrompt = `Provide comprehensive negotiation strategy for ${negotiationType}:

Deal Data: ${JSON.stringify(dealData, null, 2)}
Counterparty Info: ${JSON.stringify(counterpartyInfo, null, 2)}
Current Stage: ${currentStage}
Objectives: ${objectives.join(', ')}
Constraints: ${constraints.join(', ')}

Provide strategy in JSON format:
{
  "negotiation_strategy": {
    "overall_approach": "strategy_description",
    "key_principles": ["principle1", "principle2"],
    "bargaining_power_analysis": {
      "our_strengths": ["strength1", "strength2"],
      "our_weaknesses": ["weakness1", "weakness2"],
      "counterparty_strengths": ["strength1", "strength2"],
      "counterparty_weaknesses": ["weakness1", "weakness2"]
    }
  },
  "tactical_recommendations": [
    {
      "stage": "stage_name",
      "recommendations": ["recommendation1", "recommendation2"],
      "key_messages": ["message1", "message2"],
      "red_lines": ["red_line1", "red_line2"]
    }
  ],
  "communication_strategy": {
    "tone": "professional|collaborative|assertive",
    "key_messaging": ["message1", "message2"],
    "presentation_focus": ["focus1", "focus2"],
    "objection_handling": [
      {
        "objection": "objection_description",
        "response": "response_strategy"
      }
    ]
  },
  "deal_structure_recommendations": {
    "payment_terms": "recommended_terms",
    "earn_out_structure": "earn_out_recommendation",
    "escrow_requirements": "escrow_recommendation",
    "closing_conditions": ["condition1", "condition2"]
  },
  "timeline_strategy": {
    "optimal_timing": "timing_recommendation",
    "milestones": [
      {
        "milestone": "milestone_name",
        "target_date": "date",
        "dependencies": ["dependency1", "dependency2"]
      }
    ],
    "pressure_points": ["pressure1", "pressure2"]
  }
}`

  switch (negotiationType) {
    case 'acquisition':
      return `${basePrompt}

Focus on:
- Valuation negotiations
- Due diligence coordination
- Integration planning
- Cultural alignment
- Regulatory compliance`
    
    case 'merger':
      return `${basePrompt}

Focus on:
- Equal partnership dynamics
- Synergy identification
- Governance structure
- Brand integration
- Stakeholder alignment`
    
    case 'divestiture':
      return `${basePrompt}

Focus on:
- Asset valuation
- Employee transition
- Customer retention
- Regulatory approvals
- Clean separation`
    
    case 'joint_venture':
      return `${basePrompt}

Focus on:
- Partnership structure
- Resource contribution
- Risk sharing
- Exit strategies
- Performance metrics`
    
    default:
      return basePrompt
  }
}

function getFallbackNegotiation(negotiationType: string, dealData: any, counterpartyInfo: any, currentStage: string, objectives: string[], constraints: string[]) {
  const demoNegotiation = {
    negotiation_strategy: {
      overall_approach: "Сотрудничающий подход с твердыми позициями по ключевым вопросам",
      key_principles: [
        "Создание взаимной ценности",
        "Прозрачность в коммуникации",
        "Защита ключевых интересов",
        "Гибкость в структуре сделки"
      ],
      bargaining_power_analysis: {
        our_strengths: [
          "Сильная финансовая позиция",
          "Стратегическое соответствие",
          "Операционные синергии",
          "Стабильная команда менеджмента"
        ],
        our_weaknesses: [
          "Ограниченное время на сделку",
          "Зависимость от регулятивных одобрений",
          "Потенциальные интеграционные риски"
        ],
        counterparty_strengths: [
          "Уникальные активы",
          "Сильная рыночная позиция",
          "Стабильные денежные потоки"
        ],
        counterparty_weaknesses: [
          "Ограниченный доступ к капиталу",
          "Необходимость в стратегическом партнере",
          "Операционные вызовы"
        ]
      }
    },
    tactical_recommendations: [
      {
        stage: "Initial Contact",
        recommendations: [
          "Установить личные отношения с ключевыми лицами",
          "Презентовать стратегическое видение",
          "Обсудить потенциальные синергии"
        ],
        key_messages: [
          "Мы видим значительный потенциал для создания стоимости",
          "Наш подход основан на долгосрочном партнерстве"
        ],
        red_lines: [
          "Не раскрывать детальную финансовую информацию",
          "Не обсуждать конкретные условия до due diligence"
        ]
      },
      {
        stage: "Due Diligence",
        recommendations: [
          "Провести тщательный анализ всех аспектов",
          "Выявить потенциальные риски и возможности",
          "Подготовить детальную интеграционную стратегию"
        ],
        key_messages: [
          "Наша due diligence поможет оптимизировать структуру сделки",
          "Мы стремимся к полному пониманию бизнеса"
        ],
        red_lines: [
          "Не принимать на себя необоснованные обязательства",
          "Требовать полного доступа к информации"
        ]
      },
      {
        stage: "Term Sheet",
        recommendations: [
          "Предложить справедливую оценку с премией",
          "Включить защитные механизмы",
          "Определить ключевые условия закрытия"
        ],
        key_messages: [
          "Наше предложение отражает полную стоимость активов",
          "Мы готовы к быстрому закрытию при выполнении условий"
        ],
        red_lines: [
          "Не превышать максимальную цену",
          "Требовать определенные условия закрытия"
        ]
      }
    ],
    communication_strategy: {
      tone: "collaborative",
      key_messaging: [
        "Создание долгосрочной стоимости для всех стейкхолдеров",
        "Стратегическое партнерство на основе взаимного уважения",
        "Операционные синергии и рост бизнеса"
      ],
      presentation_focus: [
        "Стратегическое соответствие",
        "Финансовые возможности",
        "Интеграционный опыт",
        "Долгосрочное видение"
      ],
      objection_handling: [
        {
          objection: "Цена слишком низкая",
          response: "Наша оценка основана на детальном анализе и отражает справедливую стоимость с учетом рисков и синергий"
        },
        {
          objection: "Интеграционные риски",
          response: "У нас есть проверенная методология интеграции и опыт успешных сделок в отрасли"
        },
        {
          objection: "Время на сделку слишком короткое",
          response: "Мы готовы работать в ускоренном режиме, но качество due diligence не пострадает"
        }
      ]
    },
    deal_structure_recommendations: {
      payment_terms: "70% наличными при закрытии, 30% в виде earn-out на 3 года",
      earn_out_structure: "Привязан к EBITDA и росту выручки с защитными механизмами",
      escrow_requirements: "10% от цены сделки на 18 месяцев для покрытия репрезентаций",
      closing_conditions: [
        "Регулятивные одобрения",
        "Due diligence удовлетворительна",
        "Ключевые контракты переведены",
        "Финансирование обеспечено"
      ]
    },
    timeline_strategy: {
      optimal_timing: "Закрытие в течение 4-6 месяцев для максимизации синергий",
      milestones: [
        {
          milestone: "Подписание LOI",
          target_date: "Через 2 недели",
          dependencies: ["Завершение предварительной due diligence", "Согласование основных условий"]
        },
        {
          milestone: "Завершение Due Diligence",
          target_date: "Через 6 недель",
          dependencies: ["Полный доступ к информации", "Формирование команды"]
        },
        {
          milestone: "Подписание SPA",
          target_date: "Через 10 недель",
          dependencies: ["Согласование всех условий", "Регулятивные одобрения"]
        },
        {
          milestone: "Закрытие сделки",
          target_date: "Через 16 недель",
          dependencies: ["Выполнение всех условий закрытия", "Перевод средств"]
        }
      ],
      pressure_points: [
        "Конкуренция со стороны других покупателей",
        "Регулятивные сроки",
        "Сезонность бизнеса",
        "Финансовые обязательства"
      ]
    },
    metadata: {
      negotiation_type: negotiationType,
      current_stage,
      deal_value: dealData.value || 'unknown',
      created_at: new Date().toISOString(),
      model_used: 'demo-fallback',
      tokens_used: 0
    },
    ai_insights: generateNegotiationInsights(negotiationType, dealData, counterpartyInfo),
    risk_assessment: assessNegotiationRisks(dealData, counterpartyInfo),
    success_probability: calculateSuccessProbability(dealData, counterpartyInfo, objectives)
  }

  return NextResponse.json({
    success: true,
    negotiation: demoNegotiation
  })
}

function generateNegotiationInsights(negotiationType: string, dealData: any, counterpartyInfo: any) {
  return {
    power_dynamics: "Сбалансированная ситуация с небольшим преимуществом покупателя",
    key_leverage_points: [
      "Финансовые возможности",
      "Стратегическая необходимость",
      "Операционные синергии"
    ],
    potential_deal_breakers: [
      "Регулятивные препятствия",
      "Культурные различия",
      "Интеграционные риски"
    ],
    optimal_approach: "Сотрудничающий с элементами твердости",
    timing_recommendation: "Умеренная скорость для баланса качества и эффективности"
  }
}

function assessNegotiationRisks(dealData: any, counterpartyInfo: any) {
  return {
    overall_risk_level: "medium",
    key_risks: [
      {
        risk: "Регулятивные риски",
        probability: "medium",
        impact: "high",
        mitigation: "Раннее вовлечение регуляторов"
      },
      {
        risk: "Интеграционные риски",
        probability: "high",
        impact: "medium",
        mitigation: "Детальное планирование интеграции"
      },
      {
        risk: "Финансовые риски",
        probability: "low",
        impact: "medium",
        mitigation: "Структурированное финансирование"
      }
    ],
    risk_score: 65
  }
}

function calculateSuccessProbability(dealData: any, counterpartyInfo: any, objectives: string[]) {
  let baseProbability = 70

  // Факторы, увеличивающие вероятность
  if (dealData.synergies > 20) baseProbability += 10
  if (counterpartyInfo.financial_strength === 'strong') baseProbability += 5
  if (objectives.length <= 3) baseProbability += 5

  // Факторы, уменьшающие вероятность
  if (dealData.complexity === 'high') baseProbability -= 10
  if (counterpartyInfo.negotiation_history === 'difficult') baseProbability -= 15

  return Math.max(20, Math.min(95, baseProbability))
} 