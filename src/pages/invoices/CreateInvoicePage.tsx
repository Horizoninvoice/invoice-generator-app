import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { ArrowLeft, Plus, Trash2, Save, Eye } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import toast from 'react-hot-toast'
import InvoiceTemplateRenderer from '@/components/invoices/InvoiceTemplateRenderer'

interface InvoiceItem {
  id: string
  product_id?: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  line_total: number
}

export default function CreateInvoicePage() {
  const { user, profile, isPro, isMax } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_id: searchParams.get('customer') || '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'draft',
    currency: profile?.currency || 'INR',
    notes: localStorage.getItem('invoice_default_notes') || '',
    terms: localStorage.getItem('invoice_default_terms') || '',
    template: 'professional',
  })

  useEffect(() => {
    if (user) {
      fetchCustomers()
      fetchProducts()
    }
  }, [user])

  // Handle product selection from URL
  useEffect(() => {
    const productId = searchParams.get('product')
    if (productId && products.length > 0 && items.length === 0) {
      const product = products.find((p) => p.id === productId)
      if (product) {
        const newItem: InvoiceItem = {
          id: Date.now().toString(),
          product_id: productId,
          description: product.name,
          quantity: 1,
          unit_price: product.price,
          tax_rate: product.tax_rate || 0,
          line_total: product.price * (1 + (product.tax_rate || 0) / 100),
        }
        setItems([newItem])
      }
    }
  }, [searchParams, products])

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*').eq('user_id', user!.id).order('name')
    setCustomers(data || [])
  }

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('user_id', user!.id).order('name')
    setProducts(data || [])
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description: '',
      quantity: 1,
      unit_price: 0,
      tax_rate: 0,
      line_total: 0,
    }
    setItems([...items, newItem])
    
    // Scroll to the new item after a short delay
    setTimeout(() => {
      const element = document.getElementById(`item-${newItem.id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }, 100)
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          
          // Handle product selection
          if (field === 'product_id' && value) {
            const product = products.find((p) => p.id === value)
            if (product) {
              updated.description = product.name
              updated.unit_price = product.price || 0
              updated.tax_rate = product.tax_rate || 0
            }
          }
          
          // Ensure numeric values are numbers, not strings
          const quantity = typeof updated.quantity === 'number' ? updated.quantity : parseFloat(updated.quantity) || 0
          const unitPrice = typeof updated.unit_price === 'number' ? updated.unit_price : parseFloat(updated.unit_price) || 0
          const taxRate = typeof updated.tax_rate === 'number' ? updated.tax_rate : parseFloat(updated.tax_rate) || 0
          
          // Recalculate line total whenever quantity, unit_price, or tax_rate changes
          if (['quantity', 'unit_price', 'tax_rate', 'product_id'].includes(field)) {
            const subtotal = quantity * unitPrice
            const tax = subtotal * (taxRate / 100)
            updated.line_total = subtotal + tax
          }
          
          return updated
        }
        return item
      })
    )
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      const qty = typeof item.quantity === 'number' ? item.quantity : parseFloat(String(item.quantity)) || 0
      const price = typeof item.unit_price === 'number' ? item.unit_price : parseFloat(String(item.unit_price)) || 0
      return sum + (qty * price)
    }, 0)
    
    const taxAmount = items.reduce((sum, item) => {
      const qty = typeof item.quantity === 'number' ? item.quantity : parseFloat(String(item.quantity)) || 0
      const price = typeof item.unit_price === 'number' ? item.unit_price : parseFloat(String(item.unit_price)) || 0
      const taxRate = typeof item.tax_rate === 'number' ? item.tax_rate : parseFloat(String(item.tax_rate)) || 0
      const itemSubtotal = qty * price
      return sum + (itemSubtotal * (taxRate / 100))
    }, 0)
    
    const total = subtotal + taxAmount
    return { subtotal, taxAmount, total }
  }

  const { subtotal, taxAmount, total } = calculateTotals()

  const FREE_TEMPLATES = ['professional', 'default']
  const isTemplateAllowed = isPro || isMax || FREE_TEMPLATES.includes(formData.template)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error('Please add at least one item')
      return
    }

    if (!isTemplateAllowed) {
      toast.error('This template requires a Pro or Max subscription')
      return
    }

    setIsLoading(true)

    try {
      // Generate invoice number if not provided
      let invoiceNumber = formData.invoice_number
      if (!invoiceNumber) {
        const { count } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user!.id)
        invoiceNumber = `INV-${String((count || 0) + 1).padStart(6, '0')}`
      }

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          customer_id: formData.customer_id || null,
          issue_date: formData.issue_date,
          due_date: formData.due_date || null,
          status: formData.status,
          currency: formData.currency,
          notes: formData.notes,
          terms: formData.terms,
          template: formData.template,
          subtotal,
          tax_amount: taxAmount,
          discount_amount: 0,
          total_amount: total,
          user_id: user!.id,
        })
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Insert invoice items
      const invoiceItems = items.map((item) => ({
        invoice_id: invoice.id,
        product_id: item.product_id || null,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        line_total: item.line_total,
      }))

      const { error: itemsError } = await supabase.from('invoice_items').insert(invoiceItems)
      if (itemsError) throw itemsError

      toast.success('Invoice created successfully!')
      navigate(`/invoices/${invoice.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create invoice')
    } finally {
      setIsLoading(false)
    }
  }

  const templateOptions = [
    { value: 'professional', label: 'Professional Template (Free)' },
    { value: 'default', label: 'Default Template (Free)' },
    { value: 'modern', label: 'Modern Template (Pro)' },
    { value: 'classic', label: 'Classic Template (Pro)' },
    { value: 'minimal', label: 'Minimal Template (Pro)' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/invoices')}>
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Invoice</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6 min-h-[calc(100vh-12rem)]">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)] pr-2">
              {/* Invoice Details */}
              <Card title="Invoice Details">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Invoice Number"
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                    placeholder="Auto-generated if left empty"
                  />
                  <Select
                    label="Customer"
                    options={[
                      { value: '', label: 'Select a customer' },
                      ...customers.map((c) => ({ value: c.id, label: c.name })),
                    ]}
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  />
                  <Input
                    label="Issue Date"
                    type="date"
                    required
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  />
                  <Input
                    label="Due Date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                  <Select
                    label="Status"
                    options={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'sent', label: 'Sent' },
                      { value: 'paid', label: 'Paid' },
                    ]}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  />
                  <Input
                    label="Currency"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <Select
                      label="Invoice Template"
                      options={templateOptions}
                      value={formData.template}
                      onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    />
                    {!isTemplateAllowed && (
                      <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 rounded-lg text-sm">
                        This template requires a Pro or Max subscription.{' '}
                        <a href="/subscription" className="underline font-medium">
                          Upgrade now
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Invoice Items */}
              <Card
                title="Invoice Items"
                actions={
                  <Button type="button" onClick={addItem} size="sm">
                    <Plus size={16} className="mr-2" />
                    Add Item
                  </Button>
                }
              >
                {items.length > 0 ? (
                  <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar pb-2">
                    {items.map((item, index) => (
                      <div 
                        key={item.id} 
                        id={`item-${item.id}`}
                        className="grid md:grid-cols-6 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 transition-all hover:border-primary-300 dark:hover:border-primary-600"
                      >
                        <div className="md:col-span-6 flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Item #{index + 1}</span>
                        </div>
                        <div className="md:col-span-2">
                          <Select
                            label="Product"
                            options={[
                              { value: '', label: 'Custom item' },
                              ...products.map((p) => ({ value: p.id, label: p.name })),
                            ]}
                            value={item.product_id || ''}
                            onChange={(e) => updateItem(item.id, 'product_id', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            label="Description"
                            required
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          />
                        </div>
                        <Input
                          label="Quantity"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={item.quantity || ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                            updateItem(item.id, 'quantity', val)
                          }}
                        />
                        <Input
                          label="Unit Price"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={item.unit_price || ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                            updateItem(item.id, 'unit_price', val)
                          }}
                        />
                        <Input
                          label="Tax Rate (%)"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={item.tax_rate || ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                            updateItem(item.id, 'tax_rate', val)
                          }}
                        />
                        <div className="md:col-span-5 flex items-end">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Line Total: <span className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(item.line_total || 0, formData.currency)}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-end justify-end">
                          <Button 
                            type="button" 
                            variant="danger" 
                            size="sm" 
                            onClick={() => removeItem(item.id)}
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No items added yet</p>
                    <Button type="button" onClick={addItem}>
                      <Plus size={18} className="mr-2" />
                      Add First Item
                    </Button>
                  </div>
                )}

                {items.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(subtotal, formData.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                          <span className="font-medium">{formatCurrency(taxAmount, formData.currency)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-gray-900 dark:text-white">Total:</span>
                          <span className="text-gray-900 dark:text-white">{formatCurrency(total, formData.currency)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Additional Information */}
              <Card title="Additional Information">
                <div className="space-y-4">
                  <Textarea
                    label="Notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes for the customer"
                  />
                  <Textarea
                    label="Terms & Conditions"
                    rows={3}
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    placeholder="Payment terms and conditions"
                  />
                </div>
              </Card>
            </div>

            {/* Sidebar - Live Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 flex flex-col h-[calc(100vh-5rem)] space-y-4">
                {/* Live Preview - Fill remaining height */}
                <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Eye size={18} />
                      Live Preview
                    </h3>
                    <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded capitalize">
                      {formData.template}
                    </span>
                  </div>
                  <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 flex-1 flex flex-col min-h-0">
                    {items.length > 0 ? (
                      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-white dark:bg-gray-900 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 20rem)' }}>
                        <div className="transform scale-[0.65] origin-top-left" style={{ width: '153.85%', minHeight: '400px' }}>
                          <InvoiceTemplateRenderer
                            template={formData.template}
                            invoice={{
                              invoice_number: formData.invoice_number || 'INV-001',
                              issue_date: formData.issue_date,
                              due_date: formData.due_date,
                              status: formData.status,
                              currency: formData.currency,
                              subtotal: subtotal,
                              tax_amount: taxAmount,
                              discount_amount: 0,
                              total_amount: total,
                              notes: formData.notes,
                              terms: formData.terms,
                            }}
                            items={items.map((item) => ({
                              description: item.description || 'Item description',
                              quantity: item.quantity || 1,
                              unit_price: item.unit_price || 0,
                              tax_rate: item.tax_rate || 0,
                              line_total: item.line_total || 0,
                            }))}
                            customer={customers.find((c) => c.id === formData.customer_id) || null}
                            company={profile}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center">
                          <Eye size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">No items added yet</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Add invoice items to see the live preview
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Quick Summary - Below Preview */}
                <Card className="flex-shrink-0 mt-auto">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Quick Summary</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(subtotal, formData.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(taxAmount, formData.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          {formatCurrency(total, formData.currency)}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button type="submit" className="w-full" isLoading={isLoading} disabled={items.length === 0}>
                        <Save size={18} className="mr-2" />
                        {formData.status === 'draft' ? 'Save Draft' : 'Create Invoice'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
