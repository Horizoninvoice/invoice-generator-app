'use client'

import { Button } from '@/components/ui/Button'
import { FiDownload } from '@/lib/icons'
import { exportInvoicesToExcel } from '@/lib/excel'
import type { Invoice } from '@/lib/types'

export function ExportButton({ invoices }: { invoices: Invoice[] }) {
  const handleExport = () => {
    exportInvoicesToExcel(invoices)
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <FiDownload size={18} className="mr-2" />
      Export to Excel
    </Button>
  )
}

