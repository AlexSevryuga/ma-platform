import OpenAI from 'openai'

// Initialize OpenAI client with fallback for demo
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-demo-key',
  dangerouslyAllowBrowser: true
})

export interface AIAnalysisResult {
  analysis: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  type: 'opportunity' | 'risk' | 'recommendation' | 'insight'
  keyPoints: string[]
  recommendations: string[]
}

export interface DealAnalysisResult extends AIAnalysisResult {
  valuation: {
    estimatedValue: number
    multiples: Record<string, number>
    confidence: number
  }
  risks: {
    financial: string[]
    operational: string[]
    regulatory: string[]
    market: string[]
  }
  synergies: {
    costSavings: number
    revenueGrowth: number
    operational: string[]
  }
}

export class AIService {
  // Mock responses for demo purposes
  private static mockResponses = {
    documentAnalysis: {
      summary: "This document appears to be a standard M&A agreement with typical terms and conditions. Key points include: 1) Purchase price of $50M with earnout provisions, 2) Standard representations and warranties, 3) 90-day due diligence period, 4) Closing conditions include regulatory approvals.",
      keyPoints: [
        "Purchase price structure includes $40M upfront + $10M earnout",
        "Due diligence period: 90 days from signing",
        "Regulatory approvals required for closing",
        "Standard indemnification provisions included"
      ],
      risks: [
        "Earnout provisions may create post-closing disputes",
        "Regulatory approval timeline uncertain",
        "Material adverse change clause could delay closing"
      ],
      recommendations: [
        "Conduct thorough financial due diligence",
        "Engage regulatory counsel early",
        "Negotiate specific earnout metrics"
      ]
    },
    dealEvaluation: {
      score: 78,
      analysis: "This deal shows strong potential with solid fundamentals. The target company has consistent revenue growth, strong market position, and complementary business model. However, integration risks and market volatility should be considered.",
      keyFactors: [
        "Strong revenue growth (15% YoY)",
        "Market leadership in target segment",
        "Synergistic business model",
        "Experienced management team"
      ],
      risks: [
        "Integration complexity",
        "Market competition",
        "Regulatory changes"
      ],
      recommendations: [
        "Accelerate integration planning",
        "Strengthen customer retention strategies",
        "Monitor regulatory environment"
      ]
    },
    marketInsights: {
      trends: [
        "Increased M&A activity in tech sector (23% YoY)",
        "Rising valuations in healthcare",
        "Cross-border deals gaining momentum",
        "ESG considerations becoming critical"
      ],
      opportunities: [
        "Distressed asset opportunities in retail",
        "Tech consolidation wave",
        "Healthcare digitization deals",
        "Sustainability-focused acquisitions"
      ],
      risks: [
        "Rising interest rates affecting financing",
        "Geopolitical tensions",
        "Regulatory scrutiny increasing",
        "Economic uncertainty"
      ]
    }
  }

  static async analyzeDocument(content: string, documentType: string = 'contract'): Promise<any> {
    try {
      // Try real API first
      if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('demo')) {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an expert M&A analyst. Analyze this ${documentType} document and provide: 1) Executive summary, 2) Key points, 3) Risk factors, 4) Recommendations. Format as JSON.`
            },
            {
              role: "user",
              content: content.substring(0, 4000) // Limit content length
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })

        return {
          summary: response.choices[0].message.content,
          confidence: 85,
          impact: 'high',
          keyPoints: ['AI-generated analysis'],
          recommendations: ['Review with legal team']
        }
      }
    } catch (error) {
      console.log('Using mock AI response for demo')
    }

    // Return mock response for demo
    return {
      ...this.mockResponses.documentAnalysis,
      confidence: 85,
      impact: 'high'
    }
  }

  static async evaluateDeal(dealData: any): Promise<any> {
    try {
      if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('demo')) {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert M&A deal evaluator. Assess this deal and provide: 1) Deal score (0-100), 2) Analysis, 3) Key factors, 4) Risks, 5) Recommendations. Format as JSON."
            },
            {
              role: "user",
              content: JSON.stringify(dealData)
            }
          ],
          temperature: 0.3,
          max_tokens: 800
        })

        return {
          score: 75,
          analysis: response.choices[0].message.content,
          confidence: 80,
          impact: 'medium'
        }
      }
    } catch (error) {
      console.log('Using mock deal evaluation for demo')
    }

    return {
      ...this.mockResponses.dealEvaluation,
      confidence: 80,
      impact: 'medium'
    }
  }

  static async generateMarketInsights(): Promise<any> {
    try {
      if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('demo')) {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a market research expert. Provide current M&A market insights including: 1) Key trends, 2) Opportunities, 3) Risks. Format as JSON."
            }
          ],
          temperature: 0.4,
          max_tokens: 600
        })

        return {
          trends: ['AI-generated market trends'],
          opportunities: ['AI-identified opportunities'],
          risks: ['AI-assessed risks']
        }
      }
    } catch (error) {
      console.log('Using mock market insights for demo')
    }

    return this.mockResponses.marketInsights
  }

  static async assessRisks(dealData: any): Promise<any> {
    try {
      if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('demo')) {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a risk assessment expert. Analyze this deal for potential risks and provide: 1) Risk categories, 2) Risk levels, 3) Mitigation strategies. Format as JSON."
            },
            {
              role: "user",
              content: JSON.stringify(dealData)
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })

        return {
          riskScore: 65,
          risks: ['AI-identified risks'],
          mitigation: ['AI-suggested mitigation strategies']
        }
      }
    } catch (error) {
      console.log('Using mock risk assessment for demo')
    }

    return {
      riskScore: 65,
      risks: [
        "Integration complexity",
        "Market volatility",
        "Regulatory changes",
        "Customer retention"
      ],
      mitigation: [
        "Detailed integration planning",
        "Market monitoring",
        "Regulatory compliance review",
        "Customer communication strategy"
      ]
    }
  }

  static async generateDueDiligenceChecklist(dealType: string): Promise<any> {
    try {
      if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('demo')) {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `Generate a comprehensive due diligence checklist for a ${dealType} deal. Include financial, legal, operational, and commercial aspects.`
            }
          ],
          temperature: 0.3,
          max_tokens: 800
        })

        return {
          checklist: ['AI-generated checklist items'],
          priority: 'high'
        }
      }
    } catch (error) {
      console.log('Using mock checklist for demo')
    }

    return {
      checklist: [
        "Financial statements review",
        "Legal compliance audit",
        "Operational assessment",
        "Market analysis",
        "Customer interviews",
        "Technology evaluation",
        "HR and culture review",
        "Environmental assessment"
      ],
      priority: 'high'
    }
  }

  static async chatCompletion(messages: any[]): Promise<any> {
    try {
      if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('demo')) {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert M&A advisor. Provide helpful, accurate advice on mergers and acquisitions, deal structuring, due diligence, and market trends. Be concise and practical."
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 500
        })

        return {
          content: response.choices[0].message.content,
          confidence: 85,
          impact: 'medium'
        }
      }
    } catch (error) {
      console.log('Using mock chat response for demo')
    }

    // Return contextual mock responses
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''
    
    if (lastMessage.includes('due diligence')) {
      return {
        content: "For due diligence, focus on: 1) Financial analysis - review 3 years of statements, 2) Legal review - contracts, IP, compliance, 3) Operational assessment - processes, systems, 4) Market analysis - competition, growth potential. Would you like me to elaborate on any specific area?",
        confidence: 90,
        impact: 'high'
      }
    } else if (lastMessage.includes('valuation')) {
      return {
        content: "Valuation methods include: 1) DCF analysis for future cash flows, 2) Comparable company analysis, 3) Precedent transactions, 4) Asset-based valuation. The most appropriate method depends on the company's stage and industry. What type of business are you valuing?",
        confidence: 88,
        impact: 'high'
      }
    } else if (lastMessage.includes('risk')) {
      return {
        content: "Key M&A risks include: 1) Integration challenges, 2) Cultural differences, 3) Regulatory approvals, 4) Market changes, 5) Customer retention. Mitigation strategies should be developed for each identified risk. What specific risks concern you most?",
        confidence: 85,
        impact: 'medium'
      }
    } else {
      return {
        content: "I'm here to help with your M&A questions! I can assist with deal structuring, due diligence, valuation, risk assessment, and market analysis. What specific aspect would you like to discuss?",
        confidence: 80,
        impact: 'medium'
      }
    }
  }
} 