

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Eye,
  Download,
  MessageSquare,
  FileText,
  Upload,
  Lock,
  Unlock,
  Scale,
  Gavel,
  HandHeart,
  TrendingUp,
  Package,
  User,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
  Flag,
  Timer,
  Zap,
  Activity,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface TransactionManagementInterfaceProps {
  userId: string;
  userRole?: string;
}

export default function TransactionManagementInterface({ 
  userId, 
  userRole = "user" 
}: TransactionManagementInterfaceProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [escrowAccounts, setEscrowAccounts] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactionData();
  }, [userId, filterStatus, filterType]);

  const fetchTransactionData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, escrowRes, disputesRes] = await Promise.all([
        fetch(`/api/secondary-market/transactions?userId=${userId}&type=buyer&status=${filterStatus !== 'all' ? filterStatus : ''}`),
        fetch(`/api/secondary-market/escrow?buyerId=${userId}`),
        fetch(`/api/secondary-market/disputes?submitterId=${userId}`),
      ]);

      const [transactionsData, escrowData, disputesData] = await Promise.all([
        transactionsRes.json(),
        escrowRes.json(),
        disputesRes.json(),
      ]);

      setTransactions(transactionsData.transactions || []);
      setEscrowAccounts(escrowData.escrowAccounts || []);
      setDisputes(disputesData.disputes || []);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAction = async (transactionId: string, action: string, data?: any) => {
    try {
      const response = await fetch('/api/secondary-market/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          transactionId,
          userId,
          ...data,
        }),
      });

      const result = await response.json();
      if (result) {
        fetchTransactionData();
      }
    } catch (error) {
      console.error('Error performing transaction action:', error);
    }
  };

  const handleEscrowAction = async (escrowAccountId: string, action: string, data?: any) => {
    try {
      const response = await fetch('/api/secondary-market/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          escrowAccountId,
          userId,
          ...data,
        }),
      });

      const result = await response.json();
      if (result) {
        fetchTransactionData();
      }
    } catch (error) {
      console.error('Error performing escrow action:', error);
    }
  };

  const handleDisputeAction = async (disputeId: string, action: string, data?: any) => {
    try {
      const response = await fetch('/api/secondary-market/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          disputeId,
          userId,
          ...data,
        }),
      });

      const result = await response.json();
      if (result) {
        fetchTransactionData();
      }
    } catch (error) {
      console.error('Error performing dispute action:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in_escrow': return <Lock className="h-5 w-5 text-blue-500" />;
      case 'disputed': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'refunded': return <XCircle className="h-5 w-5 text-gray-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_escrow': return 'bg-blue-100 text-blue-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const TransactionsOverview = () => (
    <div className="space-y-6">
      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-blue-900">{transactions?.length || 0}</p>
                  <p className="text-xs text-blue-500 mt-1">This month</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Completed</p>
                  <p className="text-2xl font-bold text-green-900">
                    {transactions?.filter(t => t.status === 'completed').length || 0}
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    {transactions?.length > 0 
                      ? Math.round((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100)
                      : 0}% success rate
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">In Escrow</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {escrowAccounts?.filter(e => e.status === 'funded').length || 0}
                  </p>
                  <p className="text-xs text-yellow-500 mt-1">Active escrows</p>
                </div>
                <Shield className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Disputes</p>
                  <p className="text-2xl font-bold text-red-900">
                    {disputes?.filter(d => d.status === 'open' || d.status === 'investigating').length || 0}
                  </p>
                  <p className="text-xs text-red-500 mt-1">Active disputes</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_escrow">In Escrow</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="trade">Trade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={fetchTransactionData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : transactions?.length > 0 ? (
              transactions
                .filter(transaction => 
                  searchQuery === '' || 
                  transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  transaction.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-500" />
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">
                            {transaction.listing?.title || `Transaction ${transaction.id.slice(0, 8)}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {transaction.transactionType} • {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(transaction.status)}
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          ${transaction.salePrice?.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Net: ${transaction.netAmount?.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {transaction.status === 'in_escrow' && (
                                <DropdownMenuItem 
                                  onClick={() => handleTransactionAction(transaction.id, 'confirm_delivery')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirm Delivery
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleTransactionAction(transaction.id, 'dispute')}
                              >
                                <Flag className="h-4 w-4 mr-2" />
                                Report Issue
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No transactions found</h3>
                <p className="text-gray-500">Your transaction history will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const EscrowManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Escrow Accounts
          </CardTitle>
          <CardDescription>
            Secure transaction processing with buyer protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {escrowAccounts?.map((escrow, index) => (
              <motion.div
                key={escrow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      escrow.status === 'funded' ? 'bg-blue-100' : 
                      escrow.status === 'released' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Shield className={`h-5 w-5 ${
                        escrow.status === 'funded' ? 'text-blue-600' : 
                        escrow.status === 'released' ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">Escrow #{escrow.escrowId}</h4>
                      <p className="text-sm text-gray-600">
                        ${escrow.escrowAmount} • {escrow.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {escrow.status === 'funded' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleEscrowAction(escrow.id, 'confirm_delivery', {
                            confirmationType: 'delivery'
                          })}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm Delivery
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEscrowAction(escrow.id, 'dispute_escrow')}
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          Dispute
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Escrow Amount</p>
                    <p className="font-semibold">${escrow.escrowAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Auto Release</p>
                    <p className="font-semibold">{escrow.autoReleaseAfter}h</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="font-semibold">
                      {new Date(escrow.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {escrow.status === 'funded' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Timer className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Auto-release in {escrow.autoReleaseAfter} hours
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Funds will be automatically released if no disputes are raised
                    </p>
                  </div>
                )}
              </motion.div>
            ))}

            {escrowAccounts?.length === 0 && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No active escrow accounts</h3>
                <p className="text-gray-500">Escrow accounts will be created automatically for secure transactions</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DisputeResolution = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-red-500" />
                Dispute Resolution
              </CardTitle>
              <CardDescription>
                Manage transaction disputes and resolution process
              </CardDescription>
            </div>
            <Button>
              <Flag className="h-4 w-4 mr-2" />
              File Dispute
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {disputes?.map((dispute, index) => (
              <motion.div
                key={dispute.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      dispute.status === 'open' ? 'bg-red-100' : 
                      dispute.status === 'resolved' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <Scale className={`h-5 w-5 ${
                        dispute.status === 'open' ? 'text-red-600' : 
                        dispute.status === 'resolved' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{dispute.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{dispute.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status}
                        </Badge>
                        <Badge variant="outline">
                          {dispute.disputeType}
                        </Badge>
                        <Badge variant="outline">
                          {dispute.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {dispute.status === 'open' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Respond
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Respond to Dispute</DialogTitle>
                            <DialogDescription>
                              Provide your response and any supporting evidence
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea 
                              placeholder="Your response..."
                              className="min-h-[100px]"
                            />
                            <div>
                              <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Evidence
                              </Button>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              onClick={() => handleDisputeAction(dispute.id, 'respond_to_dispute', {
                                response: 'Sample response',
                                evidence: []
                              })}
                            >
                              Submit Response
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Submitted</p>
                    <p className="font-semibold">
                      {new Date(dispute.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-semibold">{dispute.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Severity</p>
                    <p className="font-semibold">{dispute.severity}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mediator</p>
                    <p className="font-semibold">
                      {dispute.assignedMediator ? 'Assigned' : 'Pending'}
                    </p>
                  </div>
                </div>

                {dispute.status === 'investigating' && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <Gavel className="h-4 w-4" />
                      <span className="text-sm font-medium">Under Investigation</span>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">
                      A mediator is reviewing the case and will provide a resolution
                    </p>
                  </div>
                )}
              </motion.div>
            ))}

            {disputes?.length === 0 && (
              <div className="text-center py-8">
                <HandHeart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No disputes</h3>
                <p className="text-gray-500">All your transactions have been smooth sailing!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
              <p className="text-gray-600 mt-2">
                Monitor your transactions, escrow accounts, and resolve disputes
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="escrow" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Escrow
            </TabsTrigger>
            <TabsTrigger value="disputes" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Disputes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TransactionsOverview />
          </TabsContent>

          <TabsContent value="escrow">
            <EscrowManagement />
          </TabsContent>

          <TabsContent value="disputes">
            <DisputeResolution />
          </TabsContent>
        </Tabs>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
                <DialogDescription>
                  Transaction ID: {selectedTransaction.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold">${selectedTransaction.salePrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={getStatusColor(selectedTransaction.status)}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">
                      {new Date(selectedTransaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold">{selectedTransaction.transactionType}</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

