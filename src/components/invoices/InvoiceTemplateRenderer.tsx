import ProfessionalTemplate from './templates/ProfessionalTemplate'
import DefaultTemplate from './templates/DefaultTemplate'
import ModernTemplate from './templates/ModernTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import MinimalTemplate from './templates/MinimalTemplate'

interface InvoiceTemplateRendererProps {
  template: string
  invoice: any
  items: any[]
  customer: any
  company: any
}

export default function InvoiceTemplateRenderer({
  template,
  invoice,
  items,
  customer,
  company,
}: InvoiceTemplateRendererProps) {
  const templateMap: Record<string, React.ComponentType<any>> = {
    professional: ProfessionalTemplate,
    default: DefaultTemplate,
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
  }

  const TemplateComponent = templateMap[template] || ProfessionalTemplate

  return (
    <TemplateComponent
      invoice={invoice}
      items={items}
      customer={customer}
      company={company}
    />
  )
}

