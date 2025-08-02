'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  TrendingUp, 
  Users, 
  BarChart3, 
  FileText, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  MessageSquare,
  Target,
  DollarSign,
  Globe,
  Lock,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import UserNav from '@/components/UserNav'
import NotificationCenter from '@/components/NotificationCenter'

import { db, Deal, AIInsight } from '@/lib/db'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const deals = db.deals.getAll()
  const aiInsights = db.insights.getAll()

  const stats = [
    { label: 'Active Deals', value: '24', change: '+12%', icon: <Target className="w-5 h-5" /> },
    { label: 'Total Pipeline', value: '$2.1B', change: '+8%', icon: <DollarSign className="w-5 h-5" /> },
    { label: 'Success Rate', value: '94%', change: '+3%', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'AI Insights', value: '156', change: '+25%', icon: <Zap className="w-5 h-5" /> }
  ]

  const handleAIAnalysis = async () => {
    setIsAIAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAIAnalyzing(false)
    }, 3000)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'border-l-warning-500'
      case 'qualified': return 'border-l-primary-500'
      case 'proposal': return 'border-l-success-500'
      case 'negotiation': return 'border-l-purple-500'
      case 'closed': return 'border-l-gray-500'
      default: return 'border-l-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-danger-100 text-danger-800'
      case 'medium': return 'bg-warning-100 text-warning-800'
      case 'low': return 'bg-success-100 text-success-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-success-50 border-success-200'
      case 'risk': return 'bg-danger-50 border-danger-200'
      case 'trend': return 'bg-primary-50 border-primary-200'
      case 'recommendation': return 'bg-warning-50 border-warning-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 mr-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <h1 className="text-xl sm:text-2xl font-bold text-gradient dark:text-white">M&A AI Platform</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <NotificationCenter />
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile sidebar overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-gray-800 shadow-sm min-h-screen
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
        `}>
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <button
                onClick={() => {
                  setActiveTab('overview')
                  setIsMobileMenuOpen(false)
                }}
                className={`sidebar-item w-full ${activeTab === 'overview' ? 'active' : ''}`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Overview
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('deals')
                  setIsMobileMenuOpen(false)
                }}
                className={`sidebar-item w-full ${activeTab === 'deals' ? 'active' : ''}`}
              >
                <Target className="w-5 h-5 mr-3" />
                Deals
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('clients')
                  setIsMobileMenuOpen(false)
                }}
                className={`sidebar-item w-full ${activeTab === 'clients' ? 'active' : ''}`}
              >
                <Users className="w-5 h-5 mr-3" />
                Clients
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('ai-insights')
                  setIsMobileMenuOpen(false)
                }}
                className={`sidebar-item w-full ${activeTab === 'ai-insights' ? 'active' : ''}`}
              >
                <Zap className="w-5 h-5 mr-3" />
                AI Insights
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('documents')
                  setIsMobileMenuOpen(false)
                }}
                className={`sidebar-item w-full ${activeTab === 'documents' ? 'active' : ''}`}
              >
                <FileText className="w-5 h-5 mr-3" />
                Documents
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('analytics')
                  setIsMobileMenuOpen(false)
                }}
                className={`sidebar-item w-full ${activeTab === 'analytics' ? 'active' : ''}`}
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Analytics
              </button>
              
              <Link
                href="/ai-chat"
                className="sidebar-item w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                AI Chat
              </Link>
              
              <Link
                href="/ai-analytics"
                className="sidebar-item w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Zap className="w-5 h-5 mr-3" />
                AI Analytics
              </Link>
              
              <Link
                href="/client-search"
                className="sidebar-item w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Search className="w-5 h-5 mr-3" />
                Client Search
              </Link>
              
              <Link
                href="/innovation-hub"
                className="sidebar-item w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <RocketLaunchIcon className="w-5 h-5 mr-3" />
                Innovation Hub
              </Link>
              
              <Link
                href="/negotiation-assistant"
                className="sidebar-item w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <HandThumbUpIcon className="w-5 h-5 mr-3" />
                AI Переговоры
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-success-600 font-medium">{stat.change} from last month</p>
                      </div>
                      <div className="text-primary-600">
                        {stat.icon}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Analysis Section */}
              <div className="card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">AI-Powered Deal Analysis</h2>
                  <button
                    onClick={handleAIAnalysis}
                    disabled={isAIAnalyzing}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {isAIAnalyzing ? (
                      <>
                        <div className="spinner w-4 h-4" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Run AI Analysis</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Recent AI Insights */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent AI Insights</h3>
                    <div className="space-y-3">
                      {aiInsights.slice(0, 3).map((insight) => (
                        <div
                          key={insight.id}
                          className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{insight.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="text-xs text-gray-500">{insight.timestamp}</span>
                                <span className="text-xs font-medium">Confidence: {insight.confidence}%</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              {insight.type === 'opportunity' && <CheckCircle2 className="w-5 h-5 text-success-600" />}
                              {insight.type === 'risk' && <AlertCircle className="w-5 h-5 text-danger-600" />}
                              {insight.type === 'trend' && <TrendingUp className="w-5 h-5 text-primary-600" />}
                              {insight.type === 'recommendation' && <Star className="w-5 h-5 text-warning-600" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deal Pipeline */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Deal Pipeline</h3>
                    <div className="space-y-3">
                      {deals.map((deal) => (
                        <div
                          key={deal.id}
                          className={`pipeline-card ${getStageColor(deal.stage)}`}
                          onClick={() => setSelectedDeal(deal)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{deal.name}</h4>
                              <p className="text-sm text-gray-600">{deal.company}</p>
                                                             <div className="flex items-center mt-2 space-x-4">
                                 <span className="text-sm font-medium text-gray-900">${(deal.value / 1000000).toFixed(0)}M</span>
                                 <span className={`status-badge ${getPriorityColor(deal.priority)}`}>
                                   {deal.priority}
                                 </span>
                                 <span className="text-sm text-gray-500">{deal.probability}% probability</span>
                               </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{deal.lastActivity}</p>
                              <p className="text-sm text-gray-600">{deal.assignedTo}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <button className="btn-primary flex items-center justify-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add New Deal</span>
                  </button>
                  <button className="btn-secondary flex items-center justify-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Search Companies</span>
                  </button>
                  <button className="btn-secondary flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Deals</h1>
                <button className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  <span>New Deal</span>
                </button>
              </div>

              {/* Search and Filters */}
              <div className="card">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search deals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              {/* Deals Table */}
              <div className="card">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deal
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stage
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Probability
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expected Close
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {deals.map((deal) => (
                        <tr key={deal.id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{deal.name}</div>
                              <div className="text-sm text-gray-500">{deal.company}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {deal.value}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`status-badge ${getPriorityColor(deal.priority)}`}>
                              {deal.stage}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-primary-600 h-2 rounded-full" 
                                  style={{ width: `${deal.probability}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{deal.probability}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {deal.expectedClose}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-primary-600 hover:text-primary-900">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-danger-600 hover:text-danger-900">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-insights' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Insights</h1>
                <button
                  onClick={handleAIAnalysis}
                  disabled={isAIAnalyzing}
                  className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  {isAIAnalyzing ? (
                    <>
                      <div className="spinner w-4 h-4" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Generate Insights</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`card ${getInsightColor(insight.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {insight.type === 'opportunity' && <CheckCircle2 className="w-5 h-5 text-success-600" />}
                          {insight.type === 'risk' && <AlertCircle className="w-5 h-5 text-danger-600" />}
                          {insight.type === 'trend' && <TrendingUp className="w-5 h-5 text-primary-600" />}
                          {insight.type === 'recommendation' && <Star className="w-5 h-5 text-warning-600" />}
                          <h3 className="text-lg font-medium text-gray-900">{insight.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">{insight.timestamp}</span>
                            <span className="text-sm font-medium">Confidence: {insight.confidence}%</span>
                          </div>
                          <button className="btn-secondary text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 