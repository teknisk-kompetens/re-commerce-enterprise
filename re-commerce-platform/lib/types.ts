
export interface ContactSubmission {
  id: number
  name: string
  email: string
  company?: string
  message: string
  formType: 'contact' | 'demo' | 'interest' | 'pilot'
  status: 'new' | 'contacted' | 'qualified' | 'closed'
  createdAt: Date
  updatedAt: Date
}

export interface ContactFormData {
  name: string
  email: string
  company: string
  message: string
  formType: string
}
