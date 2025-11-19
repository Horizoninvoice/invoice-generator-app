import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Invoice, Customer, InvoiceItem } from '@/lib/types'
import { formatCurrency, formatDate } from './utils'

export function generateInvoicePDF(invoice: Invoice, customer?: Customer, items?: InvoiceItem[]) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let yPos = margin

  // Header
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', pageWidth - margin, yPos, { align: 'right' })
  yPos += 10

  // Invoice Number
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Invoice #: ${invoice.invoice_number}`, pageWidth - margin, yPos, { align: 'right' })
  yPos += 5
  doc.text(`Date: ${formatDate(invoice.issue_date)}`, pageWidth - margin, yPos, { align: 'right' })
  if (invoice.due_date) {
    yPos += 5
    doc.text(`Due Date: ${formatDate(invoice.due_date)}`, pageWidth - margin, yPos, { align: 'right' })
  }

  yPos = margin + 20

  // Bill To
  if (customer) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Bill To:', margin, yPos)
    yPos += 7
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(customer.name, margin, yPos)
    if (customer.address) {
      yPos += 5
      doc.text(customer.address, margin, yPos)
    }
    if (customer.city && customer.state) {
      yPos += 5
      doc.text(`${customer.city}, ${customer.state} ${customer.zip_code || ''}`, margin, yPos)
    }
  }

  yPos = 80

  // Items Table
  const tableData = items?.map((item) => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unit_price),
    `${item.tax_rate}%`,
    formatCurrency(item.line_total),
  ]) || []

  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'Qty', 'Unit Price', 'Tax', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [37, 165, 233], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10 },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'center' },
      4: { halign: 'right' },
    },
  })

  const finalY = (doc as any).lastAutoTable?.finalY || yPos + 50

  // Totals
  let totalsY = finalY
  doc.setFontSize(11)
  doc.text(`Subtotal: ${formatCurrency(invoice.subtotal)}`, pageWidth - margin, totalsY, { align: 'right' })
  totalsY += 7
  if (invoice.tax_amount > 0) {
    doc.text(`Tax: ${formatCurrency(invoice.tax_amount)}`, pageWidth - margin, totalsY, { align: 'right' })
    totalsY += 7
  }
  if (invoice.discount_amount > 0) {
    doc.text(`Discount: -${formatCurrency(invoice.discount_amount)}`, pageWidth - margin, totalsY, { align: 'right' })
    totalsY += 7
  }
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(`Total: ${formatCurrency(invoice.total_amount)}`, pageWidth - margin, totalsY, { align: 'right' })

  // Notes
  if (invoice.notes) {
    totalsY += 15
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Notes:', margin, totalsY)
    totalsY += 7
    doc.setFont('helvetica', 'normal')
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 2 * margin)
    doc.text(splitNotes, margin, totalsY)
  }

  // Terms
  if (invoice.terms) {
    totalsY += 15
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Terms:', margin, totalsY)
    totalsY += 7
    doc.setFont('helvetica', 'normal')
    const splitTerms = doc.splitTextToSize(invoice.terms, pageWidth - 2 * margin)
    doc.text(splitTerms, margin, totalsY)
  }

  return doc
}

