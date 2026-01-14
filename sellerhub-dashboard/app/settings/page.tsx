"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import {
  Settings,
  Key,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Amazon,
  Globe,
} from 'lucide-react'

const MARKETPLACES = [
  { id: 'ATVPDKIKX0DER', name: 'United States', flag: '🇺🇸', code: 'US' },
  { id: 'A2EUQ1WTGCTBG2', name: 'Canada', flag: '🇨🇦', code: 'CA' },
  { id: 'A1AM78C64UM0Y8', name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  { id: 'A1F83G8C2ARO7P', name: 'United Kingdom', flag: '🇬🇧', code: 'UK' },
  { id: 'A1PA6795UKMFR9', name: 'Germany', flag: '🇩🇪', code: 'DE' },
  { id: 'A13V1IB3VIYZZH', name: 'France', flag: '🇫🇷', code: 'FR' },
  { id: 'APJ6JRA9NG5A4', name: 'Italy', flag: '🇮🇹', code: 'IT' },
  { id: 'A1RKKUPIHCS9HS', name: 'Spain', flag: '🇪🇸', code: 'ES' },
  { id: 'A1VC38T7YXB5NI', name: 'Japan', flag: '🇯🇵', code: 'JP' },
  { id: 'A39IBJ37TRQ1SH', name: 'Australia', flag: '🇦🇺', code: 'AU' },
  { id: 'A21TJRUUN4KFC', name: 'India', flag: '🇮🇳', code: 'IN' },
]

interface Credential {
  id: string
  seller_id: string
  marketplace_id: string
  aws_access_key_id: string
  aws_secret_key: string
  role_arn?: string
  is_active: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    seller_id: '',
    marketplace_id: 'ATVPDKIKX0DER',
    aws_access_key_id: '',
    aws_secret_key: '',
    role_arn: '',
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Fetch credentials
  useEffect(() => {
    if (user) {
      fetchCredentials()
    }
  }, [user])

  const fetchCredentials = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('amazon_credentials')
        .select('*')
        .eq('user_id', user?.id)

      if (error) throw error
      setCredentials(data || [])
    } catch (error: any) {
      console.error('Error fetching credentials:', error)
      setMessage({ type: 'error', text: 'Failed to load credentials' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('amazon_credentials')
        .insert({
          user_id: user?.id,
          seller_id: formData.seller_id,
          marketplace_id: formData.marketplace_id,
          aws_access_key_id: formData.aws_access_key_id,
          aws_secret_key: formData.aws_secret_key,
          role_arn: formData.role_arn || null,
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Credentials saved successfully!' })
      setShowForm(false)
      setFormData({
        seller_id: '',
        marketplace_id: 'ATVPDKIKX0DER',
        aws_access_key_id: '',
        aws_secret_key: '',
        role_arn: '',
      })
      fetchCredentials()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save credentials' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete these credentials?')) return

    try {
      const { error } = await supabase
        .from('amazon_credentials')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error
      fetchCredentials()
      setMessage({ type: 'success', text: 'Credentials deleted successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to delete credentials' })
    }
  }

  const getMarketplace = (id: string) => {
    return MARKETPLACES.find((m) => m.id === id) || MARKETPLACES[0]
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500">Manage your account and integrations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Amazon SP-API Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Amazon className="w-6 h-6 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900">Amazon SP-API Integration</h2>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Credentials
                </button>
              )}
            </div>
          </div>

          {/* Add Credential Form */}
          {showForm && (
            <div className="p-6 border-b border-gray-200 bg-blue-50/50">
              <h3 className="font-medium text-gray-900 mb-4">Add Amazon SP-API Credentials</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Seller ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seller ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.seller_id}
                      onChange={(e) => setFormData({ ...formData, seller_id: e.target.value })}
                      placeholder="A1B2C3D4E5F6G7"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Found in Seller Central > Settings > Account Info
                    </p>
                  </div>

                  {/* Marketplace */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marketplace <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.marketplace_id}
                      onChange={(e) => setFormData({ ...formData, marketplace_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {MARKETPLACES.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.flag} {m.name} ({m.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* AWS Access Key ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      AWS Access Key ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.aws_access_key_id}
                      onChange={(e) => setFormData({ ...formData, aws_access_key_id: e.target.value })}
                      placeholder="AKIAIOSFODNN7EXAMPLE"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* AWS Secret Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      AWS Secret Key <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSecret ? 'text' : 'password'}
                        required
                        value={formData.aws_secret_key}
                        onChange={(e) => setFormData({ ...formData, aws_secret_key: e.target.value })}
                        placeholder="••••••••••••••••"
                        className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Role ARN (Optional) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role ARN <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.role_arn}
                      onChange={(e) => setFormData({ ...formData, role_arn: e.target.value })}
                      placeholder="arn:aws:iam::123456789012:role/YourRoleName"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Required when using IAM Role authentication
                    </p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Credentials
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setFormData({
                        seller_id: '',
                        marketplace_id: 'ATVPDKIKX0DER',
                        aws_access_key_id: '',
                        aws_secret_key: '',
                        role_arn: '',
                      })
                    }}
                    className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Credentials */}
          <div className="divide-y divide-gray-200">
            {credentials.length === 0 ? (
              <div className="p-12 text-center">
                <Key className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No credentials added</h3>
                <p className="text-gray-500 mb-4">
                  Add your Amazon SP-API credentials to start tracking your FBA business
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Credential
                </button>
              </div>
            ) : (
              credentials.map((cred) => {
                const marketplace = getMarketplace(cred.marketplace_id)
                return (
                  <div key={cred.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">{marketplace.flag}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">Seller ID: {cred.seller_id}</p>
                            {cred.is_active && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {marketplace.name} ({marketplace.code}) • {cred.aws_access_key_id}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(cred.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            How to get your Amazon SP-API credentials?
          </h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Go to <strong>Seller Central</strong> > <strong>User Permissions</strong></li>
            <li>Navigate to <strong>Develop your app</strong> or contact Amazon support for SP-API access</li>
            <li>Create an IAM user in AWS with the appropriate permissions</li>
            <li>Copy your <strong>Seller ID</strong>, <strong>AWS Access Key ID</strong>, and <strong>Secret Key</strong></li>
            <li>Add them here to start syncing your Amazon data</li>
          </ol>
          <a
            href="https://developer-docs.amazon.com/sp-api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-blue-700 hover:text-blue-800 font-medium"
          >
            Read Amazon SP-API documentation →
          </a>
        </div>
      </main>
    </div>
  )
}
