export interface Customer {
  id: string
  user_id: string
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  tax_id?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  user_id: string
  name: string
  description?: string
  price: number
  tax_rate: number
  unit: string
  sku?: string
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  product_id?: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  line_total: number
  created_at: string
}

export interface Invoice {
  id: string
  user_id: string
  invoice_number: string
  customer_id?: string
  issue_date: string
  due_date?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  currency: string
  notes?: string
  terms?: string
  template: string
  logo_url?: string
  created_at: string
  updated_at: string
  customer?: Customer
  items?: InvoiceItem[]
}

export interface Payment {
  id: string
  user_id: string
  invoice_id?: string
  amount: number
  payment_method?: string
  payment_date: string
  transaction_id?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  notes?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  role: 'free' | 'pro'
  subscription_id?: string
  subscription_status?: string
  subscription_end_date?: string
  created_at: string
  updated_at: string
}

