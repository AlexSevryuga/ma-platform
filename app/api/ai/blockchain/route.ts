import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      blockchainType, 
      dealData, 
      contractType = 'smart_contract',
      securityLevel = 'enterprise',
      compliance = true
    } = body

    if (!blockchainType || !dealData) {
      return NextResponse.json(
        { error: 'Blockchain type and deal data are required' },
        { status: 400 }
      )
    }

    // Проверяем наличие валидного OpenAI API ключа
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key') {
      return getFallbackBlockchain(blockchainType, dealData, contractType, securityLevel, compliance)
    }

    const blockchainPrompt = generateBlockchainPrompt(blockchainType, dealData, contractType, securityLevel, compliance)

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in blockchain technology and smart contracts for M&A transactions. Design secure, compliant, and efficient blockchain solutions.'
        },
        {
          role: 'user',
          content: blockchainPrompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500,
    })

    const response = completion.choices[0]?.message?.content

    if (response) {
      try {
        const blockchain = JSON.parse(response)
        
        const enhancedBlockchain = {
          ...blockchain,
          metadata: {
            blockchain_type: blockchainType,
            contract_type: contractType,
            security_level: securityLevel,
            compliance_enabled: compliance,
            created_at: new Date().toISOString(),
            model_used: 'gpt-3.5-turbo',
            tokens_used: completion.usage?.total_tokens || 0
          },
          security_features: generateSecurityFeatures(securityLevel),
          compliance_framework: generateComplianceFramework(compliance),
          performance_metrics: calculateBlockchainPerformance(blockchain)
        }

        return NextResponse.json({
          success: true,
          blockchain: enhancedBlockchain
        })
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        return getFallbackBlockchain(blockchainType, dealData, contractType, securityLevel, compliance)
      }
    }

    return getFallbackBlockchain(blockchainType, dealData, contractType, securityLevel, compliance)

  } catch (error) {
    console.error('Blockchain Error:', error)
    return getFallbackBlockchain(blockchainType, dealData, contractType, securityLevel, compliance)
  }
}

function generateBlockchainPrompt(blockchainType: string, dealData: any, contractType: string, securityLevel: string, compliance: boolean) {
  const basePrompt = `Design a blockchain solution for ${blockchainType} in M&A:

Deal Data: ${JSON.stringify(dealData, null, 2)}
Contract Type: ${contractType}
Security Level: ${securityLevel}
Compliance: ${compliance}

Provide blockchain specification in JSON format:
{
  "blockchain_architecture": {
    "network_type": "public|private|hybrid",
    "consensus_mechanism": "mechanism_description",
    "block_time": "time_in_seconds",
    "scalability_solution": "scalability_description"
  },
  "smart_contracts": [
    {
      "contract_name": "contract_name",
      "purpose": "contract_purpose",
      "functions": ["function1", "function2"],
      "security_features": ["feature1", "feature2"],
      "compliance_checks": ["check1", "check2"]
    }
  ],
  "token_economics": {
    "token_type": "utility|security|governance",
    "distribution_model": "distribution_description",
    "incentive_mechanism": "incentive_description",
    "governance_structure": "governance_description"
  },
  "security_framework": {
    "encryption_standards": ["standard1", "standard2"],
    "access_control": "access_control_description",
    "audit_trail": "audit_description",
    "risk_mitigation": ["mitigation1", "mitigation2"]
  },
  "compliance_features": {
    "regulatory_compliance": ["regulation1", "regulation2"],
    "kyc_aml_integration": "kyc_aml_description",
    "reporting_mechanisms": ["mechanism1", "mechanism2"],
    "audit_requirements": ["requirement1", "requirement2"]
  }
}`

  switch (blockchainType) {
    case 'deal_execution':
      return `${basePrompt}

Focus on:
- Automated deal execution
- Escrow management
- Payment processing
- Regulatory compliance
- Audit trails`
    
    case 'due_diligence':
      return `${basePrompt}

Focus on:
- Document verification
- Data integrity
- Access control
- Audit trails
- Compliance reporting`
    
    case 'post_merger_integration':
      return `${basePrompt}

Focus on:
- Integration tracking
- Performance monitoring
- Stakeholder management
- Milestone tracking
- Success metrics`
    
    case 'governance':
      return `${basePrompt}

Focus on:
- Voting mechanisms
- Decision making
- Stakeholder rights
- Transparency
- Accountability`
    
    default:
      return basePrompt
  }
}

function getFallbackBlockchain(blockchainType: string, dealData: any, contractType: string, securityLevel: string, compliance: boolean) {
  const demoBlockchain = {
    blockchain_architecture: {
      network_type: "private",
      consensus_mechanism: "Proof of Authority (PoA) для корпоративного использования",
      block_time: "2 секунды для быстрого подтверждения транзакций",
      scalability_solution: "Layer 2 решения и шардинг для высокой пропускной способности"
    },
    smart_contracts: [
      {
        contract_name: "DealExecutionContract",
        purpose: "Автоматическое выполнение условий сделки",
        functions: [
          "executePayment",
          "releaseEscrow",
          "validateConditions",
          "triggerMilestones"
        ],
        security_features: [
          "Многофакторная аутентификация",
          "Шифрование данных",
          "Проверка подписей",
          "Защита от реентранси атак"
        ],
        compliance_checks: [
          "KYC/AML проверка",
          "Регулятивное соответствие",
          "Аудит транзакций",
          "Отчетность"
        ]
      },
      {
        contract_name: "DueDiligenceContract",
        purpose: "Управление процессом due diligence",
        functions: [
          "uploadDocument",
          "verifyDocument",
          "grantAccess",
          "revokeAccess"
        ],
        security_features: [
          "Шифрование документов",
          "Контроль доступа",
          "Временные ограничения",
          "Аудит действий"
        ],
        compliance_checks: [
          "Проверка подлинности",
          "Соответствие требованиям",
          "Контроль версий",
          "Отслеживание изменений"
        ]
      },
      {
        contract_name: "IntegrationContract",
        purpose: "Отслеживание интеграционных процессов",
        functions: [
          "trackMilestone",
          "updateProgress",
          "notifyStakeholders",
          "measureSuccess"
        ],
        security_features: [
          "Защита данных",
          "Контроль доступа",
          "Аудит изменений",
          "Резервное копирование"
        ],
        compliance_checks: [
          "Соответствие плану",
          "Отчетность по прогрессу",
          "Контроль качества",
          "Управление рисками"
        ]
      }
    ],
    token_economics: {
      token_type: "utility",
      distribution_model: "Распределение токенов на основе роли и вклада в сделку",
      incentive_mechanism: "Вознаграждение за успешное выполнение этапов и достижение целей",
      governance_structure: "Децентрализованное управление с голосованием стейкхолдеров"
    },
    security_framework: {
      encryption_standards: [
        "AES-256 для шифрования данных",
        "RSA-4096 для асимметричного шифрования",
        "SHA-256 для хеширования"
      ],
      access_control: "Ролевая модель доступа с многофакторной аутентификацией",
      audit_trail: "Полная запись всех действий с возможностью отслеживания",
      risk_mitigation: [
        "Регулярные аудиты безопасности",
        "Мониторинг подозрительной активности",
        "Автоматическое блокирование угроз",
        "Резервное копирование данных"
      ]
    },
    compliance_features: {
      regulatory_compliance: [
        "GDPR для защиты персональных данных",
        "SOX для финансовой отчетности",
        "ISO 27001 для информационной безопасности",
        "PCI DSS для платежных данных"
      ],
      kyc_aml_integration: "Интеграция с системами KYC/AML для проверки участников",
      reporting_mechanisms: [
        "Автоматическая генерация отчетов",
        "Регулятивная отчетность",
        "Внутренний аудит",
        "Внешний аудит"
      ],
      audit_requirements: [
        "Регулярные аудиты безопасности",
        "Аудит соответствия требованиям",
        "Аудит производительности",
        "Аудит доступности"
      ]
    },
    metadata: {
      blockchain_type: blockchainType,
      contract_type: contractType,
      security_level: securityLevel,
      compliance_enabled: compliance,
      created_at: new Date().toISOString(),
      model_used: 'demo-fallback',
      tokens_used: 0
    },
    security_features: generateSecurityFeatures(securityLevel),
    compliance_framework: generateComplianceFramework(compliance),
    performance_metrics: calculateBlockchainPerformance({
      blockchain_architecture: { network_type: "private", consensus_mechanism: "PoA" },
      smart_contracts: [{ contract_name: "DealExecutionContract" }, { contract_name: "DueDiligenceContract" }]
    })
  }

  return NextResponse.json({
    success: true,
    blockchain: demoBlockchain
  })
}

function generateSecurityFeatures(securityLevel: string) {
  const features = {
    basic: [
      "Базовая аутентификация",
      "Шифрование данных",
      "Контроль доступа"
    ],
    enterprise: [
      "Многофакторная аутентификация",
      "Шифрование end-to-end",
      "Ролевая модель доступа",
      "Аудит безопасности",
      "Защита от DDoS атак"
    ],
    military: [
      "Квантовое шифрование",
      "Биометрическая аутентификация",
      "Изоляция сетей",
      "Реальное время мониторинг",
      "Автоматическое реагирование на угрозы"
    ]
  }

  return {
    security_level: securityLevel,
    features: features[securityLevel as keyof typeof features] || features.enterprise,
    certifications: [
      "ISO 27001",
      "SOC 2 Type II",
      "PCI DSS",
      "GDPR Compliance"
    ],
    monitoring: [
      "24/7 мониторинг безопасности",
      "Автоматическое обнаружение угроз",
      "Уведомления в реальном времени",
      "Аналитика безопасности"
    ]
  }
}

function generateComplianceFramework(compliance: boolean) {
  return {
    enabled: compliance,
    frameworks: [
      "GDPR - Общий регламент по защите данных",
      "SOX - Закон Сарбейнса-Оксли",
      "ISO 27001 - Информационная безопасность",
      "PCI DSS - Стандарт безопасности индустрии платежных карт"
    ],
    features: [
      "Автоматическая проверка соответствия",
      "Генерация отчетов о соответствии",
      "Управление согласиями",
      "Право на забвение"
    ],
    reporting: [
      "Ежеквартальные отчеты о соответствии",
      "Годовые аудиты",
      "Регулятивная отчетность",
      "Внутренние проверки"
    ]
  }
}

function calculateBlockchainPerformance(blockchain: any) {
  const contractCount = blockchain.smart_contracts?.length || 0
  const networkType = blockchain.blockchain_architecture?.network_type || 'private'

  return {
    transaction_speed: networkType === 'private' ? '1000+ TPS' : '100+ TPS',
    confirmation_time: networkType === 'private' ? '< 2 секунды' : '< 10 секунд',
    scalability: contractCount > 5 ? 'high' : contractCount > 2 ? 'medium' : 'low',
    cost_efficiency: networkType === 'private' ? 'high' : 'medium',
    performance_optimization: [
      "Оптимизация смарт-контрактов",
      "Использование Layer 2 решений",
      "Кэширование данных",
      "Балансировка нагрузки"
    ]
  }
} 