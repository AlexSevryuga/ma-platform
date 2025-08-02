// Database layer with Prisma + fallback to mock data
import prisma from './prisma'
export interface Deal {
  id: string
  name: string
  company: string
  value: number
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed'
  probability: number
  expectedClose: string
  lastActivity: string
  assignedTo: string
  priority: 'high' | 'medium' | 'low'
}

export interface AIInsight {
  id: string
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  timestamp: string
}

export interface Client {
  id: string
  name: string
  company: string
  industry: string
  location: string
  revenue: string
  employees: string
  description: string
  contactInfo: {
    email: string
    phone: string
    website: string
  }
  score: number
  status: 'hot' | 'warm' | 'cold'
  lastContact: string
  dealPotential: string
  tags: string[]
}

// Mock data
export const mockDeals: Deal[] = [
  {
    id: '1',
    name: 'TechCorp Acquisition',
    company: 'TechCorp Inc.',
    value: 45000000,
    stage: 'negotiation',
    probability: 85,
    expectedClose: '2024-03-15',
    lastActivity: '2 hours ago',
    assignedTo: 'Sarah Johnson',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Global Retail Merger',
    company: 'Retail Solutions Ltd.',
    value: 120000000,
    stage: 'proposal',
    probability: 65,
    expectedClose: '2024-04-20',
    lastActivity: '1 day ago',
    assignedTo: 'Michael Chen',
    priority: 'medium'
  },
  {
    id: '3',
    name: 'Healthcare Partnership',
    company: 'MedTech Systems',
    value: 75000000,
    stage: 'qualified',
    probability: 45,
    expectedClose: '2024-05-10',
    lastActivity: '3 days ago',
    assignedTo: 'Emily Rodriguez',
    priority: 'high'
  }
]

export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'High Probability Deal Alert',
    description: 'TechCorp acquisition shows 85% success probability based on market conditions and company performance.',
    impact: 'high',
    confidence: 92,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'risk',
    title: 'Regulatory Risk Detected',
    description: 'Potential antitrust concerns identified in Global Retail merger. Recommend additional legal review.',
    impact: 'medium',
    confidence: 78,
    timestamp: '1 day ago'
  },
  {
    id: '3',
    type: 'trend',
    title: 'Market Trend Analysis',
    description: 'Healthcare sector showing increased M&A activity. 23% more deals expected in Q2 2024.',
    impact: 'low',
    confidence: 85,
    timestamp: '3 days ago'
  }
]

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp Solutions',
    industry: 'Technology',
    location: 'San Francisco, CA',
    revenue: '$50M - $100M',
    employees: '200-500',
    description: 'Leading provider of enterprise software solutions with strong growth potential.',
    contactInfo: {
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (415) 555-0123',
      website: 'www.techcorp.com'
    },
    score: 92,
    status: 'hot',
    lastContact: '2 days ago',
    dealPotential: '$5M - $10M',
    tags: ['Enterprise', 'SaaS', 'Growth Stage']
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'Global Retail Group',
    industry: 'Retail',
    location: 'New York, NY',
    revenue: '$100M - $500M',
    employees: '1000-5000',
    description: 'Multi-national retail chain looking for digital transformation opportunities.',
    contactInfo: {
      email: 'mchen@globalretail.com',
      phone: '+1 (212) 555-0456',
      website: 'www.globalretail.com'
    },
    score: 85,
    status: 'warm',
    lastContact: '1 week ago',
    dealPotential: '$10M - $25M',
    tags: ['Retail', 'Digital Transformation', 'International']
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'MedTech Innovations',
    industry: 'Healthcare',
    location: 'Boston, MA',
    revenue: '$25M - $50M',
    employees: '100-200',
    description: 'Innovative medical technology startup with breakthrough products.',
    contactInfo: {
      email: 'emily@medtechinnovations.com',
      phone: '+1 (617) 555-0789',
      website: 'www.medtechinnovations.com'
    },
    score: 78,
    status: 'warm',
    lastContact: '3 days ago',
    dealPotential: '$2M - $5M',
    tags: ['Healthcare', 'Startup', 'Innovation']
  }
]

// Database functions - using mock data for stable demo
export const db = {
  deals: {
    getAll: () => {
      // Always use mock data for stable demo
      return mockDeals
    },
    
    getById: (id: string) => {
      return mockDeals.find(deal => deal.id === id) || null
    },
    
    create: (dealData: Omit<Deal, 'id'>) => {
      const newDeal = { ...dealData, id: Date.now().toString() }
      mockDeals.push(newDeal)
      return newDeal
    },
    
    update: (id: string, updates: Partial<Deal>) => {
      const index = mockDeals.findIndex(deal => deal.id === id)
      if (index !== -1) {
        mockDeals[index] = { ...mockDeals[index], ...updates, lastActivity: 'Recently updated' }
        return mockDeals[index]
      }
      return null
    },
    
    delete: (id: string) => {
      const index = mockDeals.findIndex(deal => deal.id === id)
      if (index !== -1) {
        return mockDeals.splice(index, 1)[0]
      }
      return null
    }
  },
  
  insights: {
    getAll: () => mockAIInsights,
    getById: (id: string) => mockAIInsights.find(insight => insight.id === id) || null,
    create: (insightData: Omit<AIInsight, 'id'>) => {
      const newInsight = { ...insightData, id: Date.now().toString(), timestamp: 'Just created' }
      mockAIInsights.push(newInsight)
      return newInsight
    }
  },
  
  clients: {
    getAll: () => mockClients, // Keep as sync for now
    getById: (id: string) => mockClients.find(client => client.id === id),
    search: (query: string) => {
      const lowerQuery = query.toLowerCase()
      return mockClients.filter(client => 
        client.name.toLowerCase().includes(lowerQuery) ||
        client.company.toLowerCase().includes(lowerQuery) ||
        client.industry.toLowerCase().includes(lowerQuery) ||
        client.description.toLowerCase().includes(lowerQuery)
      )
    }
  }
} 