import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      visualizationType, 
      dealData, 
      targetAudience = 'executives',
      format = '3d',
      interactive = true
    } = body

    if (!visualizationType || !dealData) {
      return NextResponse.json(
        { error: 'Visualization type and deal data are required' },
        { status: 400 }
      )
    }

    // Проверяем наличие валидного OpenAI API ключа
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-demo-key') {
      return getFallbackVisualization(visualizationType, dealData, targetAudience, format, interactive)
    }

    const visualizationPrompt = generateVisualizationPrompt(visualizationType, dealData, targetAudience, format, interactive)

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in data visualization and AR/VR technologies for M&A. Create immersive, interactive visualizations that transform complex deal data into intuitive experiences.'
        },
        {
          role: 'user',
          content: visualizationPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })

    const response = completion.choices[0]?.message?.content

    if (response) {
      try {
        const visualization = JSON.parse(response)
        
        const enhancedVisualization = {
          ...visualization,
          metadata: {
            visualization_type: visualizationType,
            target_audience,
            format,
            interactive,
            created_at: new Date().toISOString(),
            model_used: 'gpt-3.5-turbo',
            tokens_used: completion.usage?.total_tokens || 0
          },
          ar_vr_features: generateARVRFeatures(visualizationType, format),
          interactivity_options: generateInteractivityOptions(interactive),
          performance_optimization: calculatePerformanceOptimization(visualization)
        }

        return NextResponse.json({
          success: true,
          visualization: enhancedVisualization
        })
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        return getFallbackVisualization(visualizationType, dealData, targetAudience, format, interactive)
      }
    }

    return getFallbackVisualization(visualizationType, dealData, targetAudience, format, interactive)

  } catch (error) {
    console.error('Visualization Error:', error)
    return getFallbackVisualization(visualizationType, dealData, targetAudience, format, interactive)
  }
}

function generateVisualizationPrompt(visualizationType: string, dealData: any, targetAudience: string, format: string, interactive: boolean) {
  const basePrompt = `Create a ${format} visualization for ${visualizationType}:

Deal Data: ${JSON.stringify(dealData, null, 2)}
Target Audience: ${targetAudience}
Interactive: ${interactive}

Provide visualization specification in JSON format:
{
  "visualization_structure": {
    "main_view": "description_of_main_visualization",
    "sub_views": ["view1", "view2"],
    "navigation": "navigation_structure",
    "interactions": ["interaction1", "interaction2"]
  },
  "data_layers": [
    {
      "layer_name": "layer_name",
      "data_type": "financial|operational|strategic",
      "visual_elements": ["element1", "element2"],
      "interactivity": "interaction_description"
    }
  ],
  "ar_vr_features": {
    "immersive_elements": ["element1", "element2"],
    "spatial_organization": "spatial_layout_description",
    "user_interaction": "interaction_methods",
    "haptic_feedback": "feedback_description"
  },
  "performance_metrics": {
    "render_time": "estimated_time",
    "memory_usage": "estimated_usage",
    "optimization_level": "high|medium|low"
  },
  "accessibility_features": {
    "voice_navigation": "voice_commands",
    "gesture_control": "gesture_descriptions",
    "accessibility_modes": ["mode1", "mode2"]
  }
}`

  switch (visualizationType) {
    case 'deal_flow':
      return `${basePrompt}

Focus on:
- Deal pipeline visualization
- Progress tracking
- Risk indicators
- Timeline visualization
- Stakeholder interactions`
    
    case 'synergy_analysis':
      return `${basePrompt}

Focus on:
- Synergy identification
- Value creation visualization
- Integration planning
- Cost savings mapping
- Revenue growth projection`
    
    case 'risk_landscape':
      return `${basePrompt}

Focus on:
- Risk mapping
- Impact assessment
- Mitigation strategies
- Risk correlation
- Early warning systems`
    
    case 'financial_modeling':
      return `${basePrompt}

Focus on:
- Financial projections
- Sensitivity analysis
- Scenario modeling
- Valuation visualization
- Cash flow mapping`
    
    default:
      return basePrompt
  }
}

function getFallbackVisualization(visualizationType: string, dealData: any, targetAudience: string, format: string, interactive: boolean) {
  const demoVisualization = {
    visualization_structure: {
      main_view: "Интерактивная 3D карта сделки с возможностью навигации по различным аспектам",
      sub_views: [
        "Финансовая панель с реальным временем",
        "Риск-ландшафт с цветовой кодировкой",
        "Временная шкала с вехами"
      ],
      navigation: "Голосовое управление и жесты для навигации в AR/VR пространстве",
      interactions: [
        "Прикосновение к элементам для детальной информации",
        "Голосовые команды для фильтрации данных",
        "Жесты для масштабирования и поворота"
      ]
    },
    data_layers: [
      {
        layer_name: "Финансовые данные",
        data_type: "financial",
        visual_elements: [
          "3D графики доходов и расходов",
          "Интерактивные диаграммы денежных потоков",
          "Визуализация синергий в реальном времени"
        ],
        interactivity: "Прикосновение к элементам показывает детальную аналитику"
      },
      {
        layer_name: "Операционные метрики",
        data_type: "operational",
        visual_elements: [
          "Карта операционных процессов",
          "Визуализация интеграционных точек",
          "Индикаторы производительности"
        ],
        interactivity: "Голосовые команды для фильтрации по отделам"
      },
      {
        layer_name: "Стратегические инсайты",
        data_type: "strategic",
        visual_elements: [
          "3D карта конкурентного ландшафта",
          "Визуализация рыночных возможностей",
          "Стратегические сценарии"
        ],
        interactivity: "Жесты для переключения между сценариями"
      }
    ],
    ar_vr_features: {
      immersive_elements: [
        "Полноценное AR окружение для презентаций",
        "VR симуляция интеграционных процессов",
        "Голографические проекции финансовых данных"
      ],
      spatial_organization: "Данные организованы в 3D пространстве с логической группировкой по категориям",
      user_interaction: "Естественные жесты, голосовые команды и тактильная обратная связь",
      haptic_feedback: "Тактильная обратная связь при взаимодействии с критическими данными"
    },
    performance_metrics: {
      render_time: "60 FPS для плавного AR/VR опыта",
      memory_usage: "Оптимизировано для мобильных AR устройств",
      optimization_level: "high"
    },
    accessibility_features: {
      voice_navigation: [
        "Показать финансовые данные",
        "Фильтровать по рискам",
        "Увеличить масштаб",
        "Переключить сценарий"
      ],
      gesture_control: [
        "Свайп для навигации",
        "Щипок для масштабирования",
        "Поворот руки для поворота вида"
      ],
      accessibility_modes: [
        "Высокий контраст для слабовидящих",
        "Увеличенный текст",
        "Аудио описания для слепых"
      ]
    },
    metadata: {
      visualization_type: visualizationType,
      target_audience,
      format,
      interactive,
      created_at: new Date().toISOString(),
      model_used: 'demo-fallback',
      tokens_used: 0
    },
    ar_vr_features: generateARVRFeatures(visualizationType, format),
    interactivity_options: generateInteractivityOptions(interactive),
    performance_optimization: calculatePerformanceOptimization({
      visualization_structure: { main_view: "3D visualization" },
      data_layers: [{ data_type: "financial" }, { data_type: "operational" }]
    })
  }

  return NextResponse.json({
    success: true,
    visualization: demoVisualization
  })
}

function generateARVRFeatures(visualizationType: string, format: string) {
  const features = {
    deal_flow: [
      "AR карта сделки с голографическими вехами",
      "VR симуляция переговорного процесса",
      "Интерактивные временные линии в 3D"
    ],
    synergy_analysis: [
      "3D визуализация синергий между компаниями",
      "AR наложение операционных процессов",
      "VR симуляция интеграционных сценариев"
    ],
    risk_landscape: [
      "3D карта рисков с цветовой кодировкой",
      "AR индикаторы раннего предупреждения",
      "VR симуляция кризисных сценариев"
    ],
    financial_modeling: [
      "Голографические финансовые модели",
      "AR проекция денежных потоков",
      "VR симуляция различных сценариев"
    ]
  }

  return {
    primary_features: features[visualizationType as keyof typeof features] || features.deal_flow,
    format_support: format === '3d' ? ['AR', 'VR', 'Holographic'] : ['2D', 'Interactive'],
    device_compatibility: ['Microsoft HoloLens', 'Meta Quest', 'Apple Vision Pro', 'Mobile AR'],
    collaboration_features: [
      "Многопользовательские AR сессии",
      "Совместная работа в VR пространстве",
      "Голографические презентации"
    ]
  }
}

function generateInteractivityOptions(interactive: boolean) {
  return {
    enabled: interactive,
    interaction_methods: [
      "Голосовые команды",
      "Жесты рук",
      "Тактильная обратная связь",
      "Глазной трекинг",
      "Мозговые волны (экспериментально)"
    ],
    customization_options: [
      "Персонализация интерфейса",
      "Настройка жестов",
      "Голосовые профили",
      "Предпочтения отображения"
    ],
    accessibility_features: [
      "Голосовое управление",
      "Увеличенный интерфейс",
      "Высокий контраст",
      "Аудио описания"
    ]
  }
}

function calculatePerformanceOptimization(visualization: any) {
  const dataLayers = visualization.data_layers?.length || 0
  const complexity = dataLayers > 3 ? 'high' : dataLayers > 1 ? 'medium' : 'low'

  return {
    optimization_level: complexity,
    recommended_settings: {
      render_quality: complexity === 'high' ? 'medium' : 'high',
      update_frequency: complexity === 'high' ? '30fps' : '60fps',
      detail_level: complexity === 'high' ? 'reduced' : 'full'
    },
    performance_tips: [
      "Используйте LOD (Level of Detail) для сложных сцен",
      "Оптимизируйте текстуры для мобильных устройств",
      "Используйте кэширование для часто запрашиваемых данных"
    ]
  }
} 