import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      workflowType, 
      dealData, 
      stage, 
      requirements = [],
      automationLevel = 'full'
    } = body

    if (!workflowType || !dealData) {
      return NextResponse.json(
        { error: 'Workflow type and deal data are required' },
        { status: 400 }
      )
    }

    // Проверяем наличие валидного OpenAI API ключа
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key') {
      return getFallbackWorkflow(workflowType, dealData, stage, requirements, automationLevel)
    }

    const workflowPrompt = generateWorkflowPrompt(workflowType, dealData, stage, requirements, automationLevel)

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert M&A workflow automation specialist. Design comprehensive, efficient workflows that optimize deal processes.'
        },
        {
          role: 'user',
          content: workflowPrompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500,
    })

    const response = completion.choices[0]?.message?.content

    if (response) {
      try {
        const workflow = JSON.parse(response)
        
        const enhancedWorkflow = {
          ...workflow,
          metadata: {
            workflow_type: workflowType,
            stage,
            automation_level: automationLevel,
            created_at: new Date().toISOString(),
            model_used: 'gpt-3.5-turbo',
            tokens_used: completion.usage?.total_tokens || 0
          },
          automation_tools: generateAutomationTools(workflowType, automationLevel),
          integration_points: identifyIntegrationPoints(workflowType),
          performance_metrics: calculatePerformanceMetrics(workflow)
        }

        return NextResponse.json({
          success: true,
          workflow: enhancedWorkflow
        })
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        return getFallbackWorkflow(workflowType, dealData, stage, requirements, automationLevel)
      }
    }

    return getFallbackWorkflow(workflowType, dealData, stage, requirements, automationLevel)

  } catch (error) {
    console.error('Workflow Automation Error:', error)
    return getFallbackWorkflow(workflowType, dealData, stage, requirements, automationLevel)
  }
}

function generateWorkflowPrompt(workflowType: string, dealData: any, stage: string, requirements: string[], automationLevel: string) {
  const basePrompt = `Design an automated M&A workflow for ${workflowType}:

Deal Data: ${JSON.stringify(dealData, null, 2)}
Stage: ${stage}
Requirements: ${requirements.join(', ')}
Automation Level: ${automationLevel}

Provide workflow in JSON format:
{
  "workflow_steps": [
    {
      "step_number": 1,
      "name": "step_name",
      "description": "detailed_description",
      "automation_level": "full|partial|manual",
      "estimated_duration": "hours|days",
      "dependencies": ["step1", "step2"],
      "tools_required": ["tool1", "tool2"],
      "outputs": ["output1", "output2"],
      "quality_gates": ["gate1", "gate2"]
    }
  ],
  "automation_benefits": {
    "time_savings": "estimated_hours",
    "cost_reduction": "estimated_percentage",
    "error_reduction": "estimated_percentage",
    "consistency_improvement": "estimated_percentage"
  },
  "risk_mitigation": [
    {
      "risk": "risk_description",
      "mitigation_strategy": "strategy_description",
      "automation_support": "how_automation_helps"
    }
  ],
  "success_metrics": [
    {
      "metric": "metric_name",
      "target": "target_value",
      "measurement_method": "how_to_measure"
    }
  ]
}`

  switch (workflowType) {
    case 'due_diligence':
      return `${basePrompt}

Focus on:
- Document collection and analysis
- Financial review automation
- Legal compliance checking
- Risk assessment automation
- Stakeholder communication`
    
    case 'deal_sourcing':
      return `${basePrompt}

Focus on:
- Target identification
- Initial screening
- Contact automation
- Qualification process
- Pipeline management`
    
    case 'valuation':
      return `${basePrompt}

Focus on:
- Financial model automation
- Comparable analysis
- Sensitivity testing
- Report generation
- Stakeholder review`
    
    case 'integration':
      return `${basePrompt}

Focus on:
- Integration planning
- Team coordination
- Progress tracking
- Risk management
- Success measurement`
    
    default:
      return basePrompt
  }
}

function getFallbackWorkflow(workflowType: string, dealData: any, stage: string, requirements: string[], automationLevel: string) {
  const demoWorkflow = {
    workflow_steps: [
      {
        step_number: 1,
        name: "Инициализация процесса",
        description: "Создание проекта и назначение команды",
        automation_level: "full",
        estimated_duration: "2 hours",
        dependencies: [],
        tools_required: ["Project Management", "Team Assignment"],
        outputs: ["Project Setup", "Team Roster"],
        quality_gates: ["Team Validation", "Resource Allocation"]
      },
      {
        step_number: 2,
        name: "Сбор данных",
        description: "Автоматизированный сбор необходимых документов и информации",
        automation_level: "full",
        estimated_duration: "3 days",
        dependencies: ["step1"],
        tools_required: ["Document Management", "Data Extraction"],
        outputs: ["Data Repository", "Initial Analysis"],
        quality_gates: ["Data Completeness", "Accuracy Check"]
      },
      {
        step_number: 3,
        name: "Анализ и оценка",
        description: "AI-анализ данных и предварительная оценка",
        automation_level: "partial",
        estimated_duration: "5 days",
        dependencies: ["step2"],
        tools_required: ["AI Analytics", "Valuation Models"],
        outputs: ["Analysis Report", "Valuation Estimate"],
        quality_gates: ["Model Validation", "Expert Review"]
      },
      {
        step_number: 4,
        name: "Подготовка рекомендаций",
        description: "Формирование финальных рекомендаций и отчетов",
        automation_level: "partial",
        estimated_duration: "2 days",
        dependencies: ["step3"],
        tools_required: ["Report Generator", "Presentation Tools"],
        outputs: ["Final Report", "Presentation"],
        quality_gates: ["Stakeholder Approval", "Final Review"]
      }
    ],
    automation_benefits: {
      time_savings: "40-60%",
      cost_reduction: "25-35%",
      error_reduction: "70-80%",
      consistency_improvement: "90-95%"
    },
    risk_mitigation: [
      {
        risk: "Неполные данные",
        mitigation_strategy: "Автоматизированная проверка полноты",
        automation_support: "AI-алгоритмы проверяют все необходимые поля"
      },
      {
        risk: "Человеческие ошибки",
        mitigation_strategy: "Автоматизированная валидация",
        automation_support: "Система проверяет логику и консистентность"
      },
      {
        risk: "Задержки в процессе",
        mitigation_strategy: "Автоматические уведомления и эскалация",
        automation_support: "Система отслеживает прогресс и уведомляет о задержках"
      }
    ],
    success_metrics: [
      {
        metric: "Время выполнения",
        target: "Сокращение на 50%",
        measurement_method: "Сравнение с историческими данными"
      },
      {
        metric: "Точность анализа",
        target: "95%+",
        measurement_method: "Валидация результатов экспертами"
      },
      {
        metric: "Удовлетворенность клиентов",
        target: "4.5/5",
        measurement_method: "Опросы после завершения"
      }
    ],
    metadata: {
      workflow_type: workflowType,
      stage,
      automation_level: automationLevel,
      created_at: new Date().toISOString(),
      model_used: 'demo-fallback',
      tokens_used: 0
    },
    automation_tools: generateAutomationTools(workflowType, automationLevel),
    integration_points: identifyIntegrationPoints(workflowType),
    performance_metrics: calculatePerformanceMetrics({
      workflow_steps: [
        { estimated_duration: "2 hours" },
        { estimated_duration: "3 days" },
        { estimated_duration: "5 days" },
        { estimated_duration: "2 days" }
      ]
    })
  }

  return NextResponse.json({
    success: true,
    workflow: demoWorkflow
  })
}

function generateAutomationTools(workflowType: string, automationLevel: string) {
  const tools = {
    due_diligence: [
      "Document AI Scanner",
      "Financial Model Generator",
      "Risk Assessment Engine",
      "Compliance Checker",
      "Stakeholder Communication Hub"
    ],
    deal_sourcing: [
      "Target Identification AI",
      "Contact Automation System",
      "Qualification Engine",
      "Pipeline Management",
      "Lead Scoring Algorithm"
    ],
    valuation: [
      "Financial Model Builder",
      "Comparable Analysis Tool",
      "Sensitivity Testing Engine",
      "Report Generator",
      "Valuation Dashboard"
    ],
    integration: [
      "Integration Planning Tool",
      "Progress Tracker",
      "Risk Management System",
      "Success Metrics Dashboard",
      "Team Coordination Hub"
    ]
  }

  return {
    primary_tools: tools[workflowType as keyof typeof tools] || tools.due_diligence,
    automation_level: automationLevel,
    integration_capabilities: [
      "CRM Integration",
      "Document Management",
      "Communication Platforms",
      "Analytics Dashboards"
    ],
    ai_capabilities: [
      "Natural Language Processing",
      "Predictive Analytics",
      "Pattern Recognition",
      "Automated Decision Support"
    ]
  }
}

function identifyIntegrationPoints(workflowType: string) {
  const integrations = {
    due_diligence: [
      { system: "Document Management", purpose: "Автоматическая загрузка и анализ документов" },
      { system: "CRM", purpose: "Отслеживание прогресса и коммуникации" },
      { system: "Financial Systems", purpose: "Интеграция финансовых данных" },
      { system: "Legal Systems", purpose: "Проверка соответствия требованиям" }
    ],
    deal_sourcing: [
      { system: "Market Intelligence", purpose: "Анализ рынка и конкурентов" },
      { system: "CRM", purpose: "Управление контактами и лидами" },
      { system: "Communication Platforms", purpose: "Автоматизированные коммуникации" },
      { system: "Analytics", purpose: "Отслеживание эффективности" }
    ],
    valuation: [
      { system: "Financial Data Providers", purpose: "Получение рыночных данных" },
      { system: "Modeling Tools", purpose: "Создание финансовых моделей" },
      { system: "Reporting Systems", purpose: "Генерация отчетов" },
      { system: "Collaboration Tools", purpose: "Командная работа" }
    ],
    integration: [
      { system: "Project Management", purpose: "Управление интеграционными проектами" },
      { system: "HR Systems", purpose: "Управление персоналом" },
      { system: "IT Systems", purpose: "Техническая интеграция" },
      { system: "Performance Monitoring", purpose: "Отслеживание результатов" }
    ]
  }

  return integrations[workflowType as keyof typeof integrations] || integrations.due_diligence
}

function calculatePerformanceMetrics(workflow: any) {
  const totalDuration = workflow.workflow_steps?.reduce((total: number, step: any) => {
    const duration = step.estimated_duration
    if (duration.includes('hours')) return total + parseInt(duration) / 24
    if (duration.includes('days')) return total + parseInt(duration)
    return total
  }, 0) || 0

  return {
    total_duration_days: totalDuration,
    efficiency_score: Math.max(0, 100 - (totalDuration * 5)),
    automation_coverage: workflow.workflow_steps?.filter((step: any) => step.automation_level === 'full').length / workflow.workflow_steps?.length * 100 || 0,
    risk_score: Math.min(100, workflow.workflow_steps?.length * 10 || 0),
    complexity_level: workflow.workflow_steps?.length > 5 ? 'high' : workflow.workflow_steps?.length > 3 ? 'medium' : 'low'
  }
} 