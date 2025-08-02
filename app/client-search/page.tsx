'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  DollarSign, 
  TrendingUp,
  Users,
  Target,
  Star,
  Mail,
  Phone,
  Globe,
  Calendar,
  BarChart3,
  Download,
  Eye,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

import { db, Client } from '@/lib/db'

interface SearchFilters {
  industry: string[]
  location: string[]
  revenueRange: string
  employeeRange: string
  dealPotential: string[]
  status: string[]
}

export default function ClientSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    industry: [],
    location: [],
    revenueRange: '',
    employeeRange: '',
    dealPotential: [],
    status: []
  })

  useEffect(() => {
    const allClients = db.clients.getAll()
    setClients(allClients)
    setFilteredClients(allClients)
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    
    // Simulate AI search
    setTimeout(() => {
      const results = db.clients.search(searchQuery)
      setFilteredClients(results)
      setIsSearching(false)
    }, 2000)
  }

  const applyFilters = () => {
    let results = clients

    if (filters.industry.length > 0) {
      results = results.filter(client => filters.industry.includes(client.industry))
    }

    if (filters.location.length > 0) {
      results = results.filter(client => filters.location.includes(client.location))
    }

    if (filters.status.length > 0) {
      results = results.filter(client => filters.status.includes(client.status))
    }

    setFilteredClients(results)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-danger-100 text-danger-800'
      case 'warm': return 'bg-warning-100 text-warning-800'
      case 'cold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-600'
    if (score >= 75) return 'text-warning-600'
    return 'text-danger-600'
  }

  const industries = ['Technology', 'Retail', 'Healthcare', 'Finance', 'Manufacturing', 'Energy']
  const locations = ['San Francisco, CA', 'New York, NY', 'Boston, MA', 'Los Angeles, CA', 'Chicago, IL']
  const revenueRanges = ['$1M - $10M', '$10M - $50M', '$50M - $100M', '$100M - $500M', '$500M+']
  const employeeRanges = ['1-50', '50-200', '200-500', '500-1000', '1000+']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Client Search</h1>
          <p className="text-gray-600">Find potential clients using advanced AI algorithms and market intelligence</p>
        </div>

        {/* Search Bar */}
        <div className="card mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for companies, industries, or specific criteria..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="btn-primary flex items-center space-x-2"
            >
              {isSearching ? (
                <>
                  <div className="spinner w-4 h-4" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <div className="space-y-2">
                    {industries.map((industry) => (
                      <label key={industry} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.industry.includes(industry)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                industry: [...prev.industry, industry]
                              }))
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                industry: prev.industry.filter(i => i !== industry)
                              }))
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <label key={location} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.location.includes(location)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                location: [...prev.location, location]
                              }))
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                location: prev.location.filter(l => l !== location)
                              }))
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="space-y-2">
                    {['hot', 'warm', 'cold'].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                status: [...prev.status, status]
                              }))
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                status: prev.status.filter(s => s !== status)
                              }))
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setFilters({
                    industry: [],
                    location: [],
                    revenueRange: '',
                    employeeRange: '',
                    dealPotential: [],
                    status: []
                  })}
                  className="btn-secondary"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Stats */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Found {filteredClients.length} potential clients
            </p>
            <div className="flex items-center space-x-2">
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-hover cursor-pointer"
              onClick={() => setSelectedClient(client)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.company}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`status-badge ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                  <span className={`text-sm font-bold ${getScoreColor(client.score)}`}>
                    {client.score}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="w-4 h-4 mr-2" />
                  <span>{client.industry}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{client.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>{client.revenue}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{client.employees} employees</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="w-4 h-4 mr-2" />
                  <span>Potential: {client.dealPotential}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Last contact: {client.lastContact}</span>
                  <div className="flex items-center space-x-2">
                    <button className="text-primary-600 hover:text-primary-700">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-primary-600 hover:text-primary-700">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="text-primary-600 hover:text-primary-700">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {client.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredClients.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="font-medium">{selectedClient.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Industry</p>
                      <p className="font-medium">{selectedClient.industry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{selectedClient.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-medium">{selectedClient.revenue}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm">{selectedClient.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm">{selectedClient.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm">{selectedClient.contactInfo.website}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Deal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">AI Score</p>
                      <p className={`font-bold text-lg ${getScoreColor(selectedClient.score)}`}>
                        {selectedClient.score}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Deal Potential</p>
                      <p className="font-medium">{selectedClient.dealPotential}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`status-badge ${getStatusColor(selectedClient.status)}`}>
                        {selectedClient.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Contact</p>
                      <p className="font-medium">{selectedClient.lastContact}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedClient.description}</p>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button className="btn-secondary">Add to Pipeline</button>
                  <button className="btn-primary">Contact Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 