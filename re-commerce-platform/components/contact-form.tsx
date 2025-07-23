
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MessageCircle, 
  Send,
  Check,
  AlertCircle,
  Sparkles
} from 'lucide-react'

export default function ContactForm() {
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
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) newErrors.name = 'Namn är obligatoriskt'
    if (!formData.email.trim()) newErrors.email = 'E-post är obligatorisk'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Ogiltig e-postadress'
    if (!formData.message.trim()) newErrors.message = 'Meddelande är obligatoriskt'
    else if (formData.message.trim().length < 10) newErrors.message = 'Meddelandet måste vara minst 10 tecken'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'contact'
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
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50" id="contact">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-green-50 border border-green-200 rounded-lg p-8"
          >
            <Check className="h-16 w-16 text-green-600 mx-auto mb-6" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Tack för ditt meddelande!
            </h2>
            <p className="text-green-700 text-lg">
              Vi återkommer inom 24 timmar för att diskutera hur vi kan hjälpa er.
            </p>
            <Button
              onClick={() => setSubmitStatus('idle')}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Skicka nytt meddelande
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section 
      className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50" 
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Redo att transformera er verksamhet?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Låt oss diskutera hur våra Enterprise-plattformar kan skapa mätbar tillväxt för er verksamhet
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Kontakta vårt expertteam
              </CardTitle>
              <p className="text-gray-600">
                Vi svarar inom 24 timmar och erbjuder kostnadsfri konsultation
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <Label htmlFor="contact-name" className="text-sm font-medium text-gray-700">
                      Namn *
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                      <Input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Ditt fullständiga namn"
                        required
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                    </div>
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                        <AlertCircle className="inline h-4 w-4 mr-1" aria-hidden="true" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
                      E-post *
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                      <Input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="din@email.com"
                        required
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                    </div>
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                        <AlertCircle className="inline h-4 w-4 mr-1" aria-hidden="true" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <Label htmlFor="contact-phone" className="text-sm font-medium text-gray-700">
                      Telefon
                    </Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                      <Input
                        id="contact-phone"
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
                    <Label htmlFor="contact-company" className="text-sm font-medium text-gray-700">
                      Företag
                    </Label>
                    <div className="relative mt-1">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                      <Input
                        id="contact-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ditt företag"
                      />
                    </div>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <Label htmlFor="contact-message" className="text-sm font-medium text-gray-700">
                    Meddelande *
                  </Label>
                  <div className="relative mt-1">
                    <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Textarea
                      id="contact-message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className={`pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
                      placeholder="Berätta om era utmaningar och mål. Hur kan vi hjälpa er att skapa mätbar tillväxt?"
                      required
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                  </div>
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
                      <AlertCircle className="inline h-4 w-4 mr-1" aria-hidden="true" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 text-lg rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Send className="h-5 w-5" aria-hidden="true" />
                      </motion.div>
                      Skickar meddelande...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" aria-hidden="true" />
                      Skicka meddelande
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
        </motion.div>
      </div>
    </section>
  )
}
