import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      collaborationType, 
      teamData, 
      projectData, 
      communicationPreferences = {},
      aiAssistance = true
    } = body

    if (!collaborationType || !teamData) {
      return NextResponse.json(
        { error: 'Collaboration type and team data are required' },
        { status: 400 }
      )
    }

    // Проверяем наличие валидного OpenAI API ключа
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key') {
      return getFallbackCollaboration(collaborationType, teamData, projectData, communicationPreferences, aiAssistance)
    }

    const collaborationPrompt = generateCollaborationPrompt(collaborationType, teamData, projectData, communicationPreferences, aiAssistance)

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert M&A collaboration and team coordination specialist. Design effective collaboration frameworks that optimize team performance and project outcomes.'
        },
        {
          role: 'user',
          content: collaborationPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })

    const response = completion.choices[0]?.message?.content

    if (response) {
      try {
        const collaboration = JSON.parse(response)
        
        const enhancedCollaboration = {
          ...collaboration,
          metadata: {
            collaboration_type: collaborationType,
            team_size: teamData.members?.length || 0,
            project_scope: projectData?.scope || 'general',
            created_at: new Date().toISOString(),
            model_used: 'gpt-3.5-turbo',
            tokens_used: completion.usage?.total_tokens || 0
          },
          ai_features: generateAIFeatures(collaborationType, aiAssistance),
          communication_tools: identifyCommunicationTools(communicationPreferences),
          performance_optimization: calculatePerformanceOptimization(collaboration)
        }

        return NextResponse.json({
          success: true,
          collaboration: enhancedCollaboration
        })
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        return getFallbackCollaboration(collaborationType, teamData, projectData, communicationPreferences, aiAssistance)
      }
    }

    return getFallbackCollaboration(collaborationType, teamData, projectData, communicationPreferences, aiAssistance)

  } catch (error) {
    console.error('Collaboration Error:', error)
    return getFallbackCollaboration(collaborationType, teamData, projectData, communicationPreferences, aiAssistance)
  }
}

function generateCollaborationPrompt(collaborationType: string, teamData: any, projectData: any, communicationPreferences: any, aiAssistance: boolean) {
  const basePrompt = `Design a collaboration framework for ${collaborationType}:

Team Data: ${JSON.stringify(teamData, null, 2)}
Project Data: ${JSON.stringify(projectData, null, 2)}
Communication Preferences: ${JSON.stringify(communicationPreferences, null, 2)}
AI Assistance: ${aiAssistance}

Provide framework in JSON format:
{
  "team_structure": {
    "roles": [
      {
        "title": "role_title",
        "responsibilities": ["responsibility1", "responsibility2"],
        "required_skills": ["skill1", "skill2"],
        "ai_support": "ai_support_description"
      }
    ],
    "reporting_hierarchy": "hierarchy_description",
    "decision_making_process": "process_description"
  },
  "communication_framework": {
    "channels": [
      {
        "type": "channel_type",
        "purpose": "purpose_description",
        "frequency": "frequency_description",
        "participants": ["participant1", "participant2"]
      }
    ],
    "meeting_schedule": [
      {
        "type": "meeting_type",
        "frequency": "frequency",
        "duration": "duration",
        "agenda": "agenda_description"
      }
    ]
  },
  "ai_collaboration_features": [
    {
      "feature": "feature_name",
      "description": "feature_description",
      "benefits": ["benefit1", "benefit2"],
      "implementation": "implementation_details"
    }
  ],
  "project_management": {
    "tools": ["tool1", "tool2"],
    "methodology": "methodology_description",
    "milestones": [
      {
        "name": "milestone_name",
        "description": "description",
        "timeline": "timeline",
        "deliverables": ["deliverable1", "deliverable2"]
      }
    ]
  },
  "quality_assurance": {
    "review_process": "process_description",
    "approval_workflow": "workflow_description",
    "feedback_mechanisms": ["mechanism1", "mechanism2"]
  }
}`

  switch (collaborationType) {
    case 'due_diligence_team':
      return `${basePrompt}

Focus on:
- Multi-disciplinary team coordination
- Document review workflows
- Expert consultation processes
- Quality control mechanisms
- Stakeholder communication`
    
    case 'deal_negotiation':
      return `${basePrompt}

Focus on:
- Negotiation team structure
- Communication protocols
- Decision-making frameworks
- Risk management coordination
- Client relationship management`
    
    case 'integration_team':
      return `${basePrompt}

Focus on:
- Cross-functional team integration
- Change management coordination
- Progress tracking mechanisms
- Stakeholder alignment
- Success measurement`
    
    case 'virtual_team':
      return `${basePrompt}

Focus on:
- Remote collaboration tools
- Time zone coordination
- Digital communication protocols
- Virtual team building
- Performance monitoring`
    
    default:
      return basePrompt
  }
}

function getFallbackCollaboration(collaborationType: string, teamData: any, projectData: any, communicationPreferences: any, aiAssistance: boolean) {
  const demoCollaboration = {
    team_structure: {
      roles: [
        {
          title: "Project Manager",
          responsibilities: [
            "Координация всех аспектов проекта",
            "Управление временными рамками",
            "Коммуникация со стейкхолдерами"
          ],
          required_skills: [
            "Управление проектами",
            "Коммуникация",
            "Лидерство"
          ],
          ai_support: "AI-ассистент для планирования и отслеживания прогресса"
        },
        {
          title: "Financial Analyst",
          responsibilities: [
            "Финансовый анализ",
            "Моделирование",
            "Оценка рисков"
          ],
          required_skills: [
            "Финансовое моделирование",
            "Анализ данных",
            "Excel/Financial Tools"
          ],
          ai_support: "AI-автоматизация рутинных расчетов и анализ трендов"
        },
        {
          title: "Legal Advisor",
          responsibilities: [
            "Правовой анализ",
            "Соответствие требованиям",
            "Документооборот"
          ],
          required_skills: [
            "Корпоративное право",
            "M&A опыт",
            "Регулятивные знания"
          ],
          ai_support: "AI-анализ документов и автоматическая проверка соответствия"
        }
      ],
      reporting_hierarchy: "Плоская структура с еженедельными отчетами",
      decision_making_process: "Консенсус команды с финальным одобрением PM"
    },
    communication_framework: {
      channels: [
        {
          type: "Slack/Teams",
          purpose: "Ежедневная коммуникация и быстрые вопросы",
          frequency: "Постоянно",
          participants: ["Вся команда"]
        },
        {
          type: "Email",
          purpose: "Формальная коммуникация и документооборот",
          frequency: "По мере необходимости",
          participants: ["Команда + стейкхолдеры"]
        },
        {
          type: "Video Calls",
          purpose: "Еженедельные встречи и важные обсуждения",
          frequency: "Еженедельно",
          participants: ["Вся команда"]
        }
      ],
      meeting_schedule: [
        {
          type: "Kick-off Meeting",
          frequency: "Однократно",
          duration: "2 часа",
          agenda: "Знакомство команды, определение целей и ролей"
        },
        {
          type: "Weekly Status",
          frequency: "Еженедельно",
          duration: "1 час",
          agenda: "Обзор прогресса, обсуждение блокеров, планирование"
        },
        {
          type: "Milestone Review",
          frequency: "По достижении вех",
          duration: "1.5 часа",
          agenda: "Обзор результатов, корректировка планов"
        }
      ]
    },
    ai_collaboration_features: [
      {
        feature: "AI Meeting Assistant",
        description: "Автоматическое создание заметок и отслеживание действий",
        benefits: [
          "Экономия времени на документирование",
          "Улучшенное отслеживание решений",
          "Автоматические напоминания"
        ],
        implementation: "Интеграция с календарем и системами коммуникации"
      },
      {
        feature: "Smart Task Assignment",
        description: "AI-рекомендации по назначению задач на основе навыков и загрузки",
        benefits: [
          "Оптимальное распределение работы",
          "Снижение перегрузки",
          "Повышение эффективности"
        ],
        implementation: "Анализ профилей навыков и текущей загрузки"
      },
      {
        feature: "Predictive Analytics",
        description: "Прогнозирование рисков и возможных задержек",
        benefits: [
          "Проактивное управление рисками",
          "Улучшенное планирование",
          "Снижение сюрпризов"
        ],
        implementation: "Анализ исторических данных и текущих метрик"
      }
    ],
    project_management: {
      tools: [
        "Asana/Jira",
        "Microsoft Project",
        "Trello",
        "Notion"
      ],
      methodology: "Гибридный подход (Agile + Waterfall)",
      milestones: [
        {
          name: "Project Initiation",
          description: "Запуск проекта и формирование команды",
          timeline: "Week 1",
          deliverables: ["Project Charter", "Team Roster", "Initial Plan"]
        },
        {
          name: "Data Collection",
          description: "Сбор всех необходимых данных и документов",
          timeline: "Weeks 2-4",
          deliverables: ["Data Repository", "Document Index", "Initial Analysis"]
        },
        {
          name: "Analysis Phase",
          description: "Проведение детального анализа",
          timeline: "Weeks 5-8",
          deliverables: ["Financial Analysis", "Risk Assessment", "Valuation"]
        },
        {
          name: "Final Report",
          description: "Подготовка финального отчета",
          timeline: "Weeks 9-10",
          deliverables: ["Final Report", "Presentation", "Recommendations"]
        }
      ]
    },
    quality_assurance: {
      review_process: "Многоуровневая проверка с участием экспертов",
      approval_workflow: "Автоматизированный workflow с уведомлениями",
      feedback_mechanisms: [
        "Еженедельные ретроспективы",
        "360-градусная обратная связь",
        "Клиентские опросы"
      ]
    },
    metadata: {
      collaboration_type: collaborationType,
      team_size: teamData.members?.length || 0,
      project_scope: projectData?.scope || 'general',
      created_at: new Date().toISOString(),
      model_used: 'demo-fallback',
      tokens_used: 0
    },
    ai_features: generateAIFeatures(collaborationType, aiAssistance),
    communication_tools: identifyCommunicationTools(communicationPreferences),
    performance_optimization: calculatePerformanceOptimization({
      team_structure: { roles: [{ title: "PM" }, { title: "Analyst" }, { title: "Legal" }] },
      communication_framework: { channels: [{ type: "Slack" }, { type: "Email" }, { type: "Video" }] }
    })
  }

  return NextResponse.json({
    success: true,
    collaboration: demoCollaboration
  })
}

function generateAIFeatures(collaborationType: string, aiAssistance: boolean) {
  const features = {
    due_diligence_team: [
      "AI Document Analysis",
      "Automated Risk Scoring",
      "Smart Task Assignment",
      "Predictive Timeline Management"
    ],
    deal_negotiation: [
      "AI Negotiation Support",
      "Real-time Market Data",
      "Automated Communication",
      "Deal Structure Optimization"
    ],
    integration_team: [
      "AI Integration Planning",
      "Progress Prediction",
      "Risk Monitoring",
      "Success Metrics Tracking"
    ],
    virtual_team: [
      "AI Meeting Assistant",
      "Smart Scheduling",
      "Virtual Team Building",
      "Performance Analytics"
    ]
  }

  return {
    primary_features: features[collaborationType as keyof typeof features] || features.due_diligence_team,
    ai_assistance_enabled: aiAssistance,
    automation_level: aiAssistance ? "high" : "medium",
    integration_capabilities: [
      "Calendar Integration",
      "Communication Platforms",
      "Project Management Tools",
      "Analytics Dashboards"
    ]
  }
}

function identifyCommunicationTools(communicationPreferences: any) {
  return {
    primary_tools: [
      "Slack/Teams",
      "Email",
      "Video Conferencing",
      "Project Management Platforms"
    ],
    preferences: communicationPreferences,
    automation_features: [
      "Auto-scheduling",
      "Smart notifications",
      "Meeting transcription",
      "Action item tracking"
    ],
    collaboration_features: [
      "Real-time editing",
      "Version control",
      "Comment threads",
      "Approval workflows"
    ]
  }
}

function calculatePerformanceOptimization(collaboration: any) {
  const teamSize = collaboration.team_structure?.roles?.length || 0
  const communicationChannels = collaboration.communication_framework?.channels?.length || 0

  return {
    team_efficiency_score: Math.max(0, 100 - (teamSize * 5)),
    communication_effectiveness: Math.min(100, communicationChannels * 20),
    collaboration_quality: teamSize > 0 && communicationChannels > 0 ? "high" : "medium",
    optimization_recommendations: [
      "Регулярные ретроспективы",
      "Автоматизация рутинных задач",
      "Улучшение коммуникационных процессов",
      "Внедрение AI-ассистентов"
    ]
  }
} 