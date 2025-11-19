'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import type { Customer, Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface InvoiceItem {
  id: string
  product_id?: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  line_total: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'draft',
    currency: 'USD',
    notes: '',
    terms: '',
  })

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [customersRes, productsRes] = await Promise.all([
        supabase.from('customers').select('*').eq('user_id', user.id),
        supabase.from('products').select('*').eq('user_id', user.id),
      ])

      if (customersRes.data) setCustomers(customersRes.data)
      if (productsRes.data) setProducts(productsRes.data)
    }

    loadData()
  }, [supabase])

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 0,
        line_total: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === 'product_id' && value) {
            const product = products.find((p) => p.id === value)
            if (product) {
              updated.description = product.name
              updated.unit_price = product.price
              updated.tax_rate = product.tax_rate
            }
          }
          updated.line_total = updated.quantity * updated.unit_price * (1 + updated.tax_rate / 100)
          return updated
        }
        return item
      })
    )
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
    const taxAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price * (item.tax_rate / 100),
      0
    )
    const total = subtotal + taxAmount
    return { subtotal, taxAmount, total }
  }

  const { subtotal, taxAmount, total } = calculateTotals()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Generate invoice number if not provided
      let invoiceNumber = formData.invoice_number
      if (!invoiceNumber) {
        const { count } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
        invoiceNumber = `INV-${String((count || 0) + 1).padStart(6, '0')}`
      }

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          ...formData,
          invoice_number: invoiceNumber,
          customer_id: formData.customer_id || null,
          due_date: formData.due_date || null,
          subtotal,
          tax_amount: taxAmount,
          discount_amount: 0,
          total_amount: total,
          user_id: user.id,
        })
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Insert invoice items
      if (items.length > 0) {
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
      }

      toast.success('Invoice created successfully!')
      router.push(`/invoices/${invoice.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create invoice')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Invoice</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card title="Invoice Details">
            <div className="grid md:grid-cols-2 gap-6">
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
            </div>
          </Card>

          <Card
            title="Invoice Items"
            actions={
              <Button type="button" onClick={addItem} size="sm">
                <FiPlus size={16} className="mr-2" />
                Add Item
              </Button>
            }
          >
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="grid md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg">
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
                    <div>
                      <Input
                        label="Quantity"
                        type="number"
                        step="0.01"
                        required
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Input
                        label="Unit Price"
                        type="number"
                        step="0.01"
                        required
                        value={item.unit_price}
                        onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Input
                        label="Tax Rate (%)"
                        type="number"
                        step="0.01"
                        value={item.tax_rate}
                        onChange={(e) => updateItem(item.id, 'tax_rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-5 flex items-end">
                      <p className="text-sm text-gray-600">
                        Line Total: <span className="font-semibold">{formatCurrency(item.line_total)}</span>
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <FiTrash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No items added yet</p>
                <Button type="button" onClick={addItem}>
                  <FiPlus size={18} className="mr-2" />
                  Add First Item
                </Button>
              </div>
            )}

            {items.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

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

          <div className="flex gap-4">
            <Button type="submit" isLoading={isLoading} disabled={items.length === 0}>
              Create Invoice
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

