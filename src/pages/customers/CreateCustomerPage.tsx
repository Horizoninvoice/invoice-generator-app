import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { countries } from '@/lib/currency'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateCustomerPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'IN',
    tax_id: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.from('customers').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        tax_id: formData.tax_id,
        notes: formData.notes || null,
        user_id: user!.id,
      })

      if (error) throw error
      toast.success('Customer created successfully!')
      navigate('/customers')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create customer')
    } finally {
      setIsLoading(false)
    }
  }

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/customers">
            <Button variant="ghost">
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-white">Add Customer</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Customer Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter customer name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@example.com"
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                  <Input
                    label="Tax ID"
                    value={formData.tax_id}
                    onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                    placeholder="Tax identification number"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Address Information</h3>
                <div className="space-y-4">
                  <Textarea
                    label="Street Address"
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                  />
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                    />
                    <Input
                      label="State/Province"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                    />
                    <Input
                      label="Zip/Postal Code"
                      value={formData.zip_code}
                      onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                      placeholder="Zip code"
                    />
                  </div>
                  <Select
                    label="Country"
                    options={[{ value: '', label: 'Select country' }, ...countryOptions]}
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Additional Information</h3>
                <Textarea
                  label="Notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes about this customer"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="submit" isLoading={isLoading} className="flex-1">
                  <Save size={18} className="mr-2" />
                  Save Customer
                </Button>
                <Link to="/customers">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  )
}
