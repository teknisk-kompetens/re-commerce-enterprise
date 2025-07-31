
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Mail, Lock, User, Building, Globe, ArrowLeft } from 'lucide-react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    companyDomain: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login?message=Account created successfully');
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
            <p className="text-muted-foreground mb-4">
              Your Mr. RE:commerce account has been created successfully.
              Redirecting to login...
            </p>
            <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto" />
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to Home */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join Mr. RE:commerce and unlock intelligent search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="space-y-4">
                <Separator />
                <div className="text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Company Information (Optional)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add your company for enterprise features
                  </p>
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Your company name"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyDomain">Company Domain</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyDomain"
                      name="companyDomain"
                      type="text"
                      placeholder="company.com"
                      value={formData.companyDomain}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
