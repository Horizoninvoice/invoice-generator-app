import * as XLSX from 'xlsx'
import type { Invoice, InvoiceItem } from '@/lib/types'

export function exportInvoicesToExcel(invoices: Invoice[]) {
  const data = invoices.map((invoice) => ({
    'Invoice Number': invoice.invoice_number,
    'Issue Date': invoice.issue_date,
    'Due Date': invoice.due_date || '',
    'Status': invoice.status,
    'Subtotal': invoice.subtotal,
    'Tax Amount': invoice.tax_amount,
    'Discount': invoice.discount_amount,
    'Total': invoice.total_amount,
    'Currency': invoice.currency,
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Invoices')

  XLSX.writeFile(wb, 'invoices.xlsx')
}

export function exportInvoiceItemsToExcel(items: InvoiceItem[]) {
  const data = items.map((item) => ({
    'Description': item.description,
    'Quantity': item.quantity,
    'Unit Price': item.unit_price,
    'Tax Rate': item.tax_rate,
    'Line Total': item.line_total,
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice Items')

  XLSX.writeFile(wb, 'invoice_items.xlsx')
}

