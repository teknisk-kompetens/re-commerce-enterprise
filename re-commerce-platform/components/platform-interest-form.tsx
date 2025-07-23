
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MessageCircle, 
  Send,
  Check,
  AlertCircle
} from 'lucide-react'

interface Platform {
  id: number
  name: string
  slug: string
  description: string
  status: string
}

interface PlatformInterestFormProps {
  platform: Platform
  accentColor?: string
}

export default function PlatformInterestForm({ platform, accentColor = 'text-blue-600' }: PlatformInterestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) newErrors.name = 'Namn är obligatoriskt'
    if (!formData.email.trim()) newErrors.email = 'E-post är obligatorisk'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Ogiltig e-postadress'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/platform-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          platformSlug: platform.slug
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-green-50 border border-green-200 rounded-lg p-6"
      >
        <Check className="h-12 w-12 text-green-600 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Tack för ditt intresse!
        </h3>
        <p className="text-green-700">
          Vi återkommer inom 24 timmar för att diskutera {platform.name}.
        </p>
      </motion.div>
    )
  }

  return (
    <Card className="bg-white border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Anmäl intresse för {platform.name}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Få tillgång till beta-versionen och påverka utvecklingen
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <Label 
              htmlFor={`name-${platform.slug}`}
              className="text-sm font-medium text-gray-700"
            >
              Namn *
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                id={`name-${platform.slug}`}
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Ditt fullständiga namn"
                required
                aria-describedby={errors.name ? `name-error-${platform.slug}` : undefined}
              />
            </div>
            {errors.name && (
              <p id={`name-error-${platform.slug}`} className="mt-1 text-sm text-red-600" role="alert">
                <AlertCircle className="inline h-4 w-4 mr-1" aria-hidden="true" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <Label 
              htmlFor={`email-${platform.slug}`}
              className="text-sm font-medium text-gray-700"
            >
              E-post *
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                id={`email-${platform.slug}`}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="din@email.com"
                required
                aria-describedby={errors.email ? `email-error-${platform.slug}` : undefined}
              />
            </div>
            {errors.email && (
              <p id={`email-error-${platform.slug}`} className="mt-1 text-sm text-red-600" role="alert">
                <AlertCircle className="inline h-4 w-4 mr-1" aria-hidden="true" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <Label 
              htmlFor={`phone-${platform.slug}`}
              className="text-sm font-medium text-gray-700"
            >
              Telefon
            </Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                id={`phone-${platform.slug}`}
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+46 70 123 45 67"
              />
            </div>
          </div>

          {/* Company Field */}
          <div>
            <Label 
              htmlFor={`company-${platform.slug}`}
              className="text-sm font-medium text-gray-700"
            >
              Företag
            </Label>
            <div className="relative mt-1">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                id={`company-${platform.slug}`}
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ditt företag"
              />
            </div>
          </div>

          {/* Message Field */}
          <div>
            <Label 
              htmlFor={`message-${platform.slug}`}
              className="text-sm font-medium text-gray-700"
            >
              Meddelande
            </Label>
            <div className="relative mt-1">
              <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Textarea
                id={`message-${platform.slug}`}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                placeholder="Berätta om dina behov och förväntningar..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </motion.div>
                Skickar...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                Anmäl Intresse
              </>
            )}
          </Button>

          {submitStatus === 'error' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-sm text-center"
              role="alert"
            >
              <AlertCircle className="inline h-4 w-4 mr-1" aria-hidden="true" />
              Ett fel uppstod. Försök igen senare.
            </motion.p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
