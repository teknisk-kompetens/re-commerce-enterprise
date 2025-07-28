
'use client';

import { useState, useEffect } from 'react';
import { 
  Code, 
  Play, 
  Copy, 
  Download, 
  Book, 
  Settings, 
  Key, 
  Globe, 
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Terminal,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface APIDocumentation {
  id: string;
  name: string;
  version: string;
  title: string;
  description: string;
  basePath?: string;
  schemes: string[];
  authTypes: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface APIExample {
  id: string;
  endpointPath: string;
  method: string;
  language: string;
  title: string;
  description?: string;
  code: string;
  request?: any;
  response?: any;
  isDefault: boolean;
}

interface APISchema {
  id: string;
  schemaName: string;
  schemaType: string;
  properties: any;
  required: string[];
  description?: string;
  example?: any;
}

interface SDKInfo {
  id: string;
  language: string;
  version: string;
  packageName: string;
  packageVersion: string;
  downloadUrl: string;
  documentation?: string;
  examples: any[];
  downloads: number;
  status: string;
  lastGenerated: string;
}

export function APIExplorerDashboard() {
  const [activeTab, setActiveTab] = useState('documentation');
  const [documentations, setDocumentations] = useState<APIDocumentation[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<APIDocumentation | null>(null);
  const [examples, setExamples] = useState<APIExample[]>([]);
  const [schemas, setSchemas] = useState<APISchema[]>([]);
  const [sdks, setSDKs] = useState<SDKInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.re-commerce.se/v1');
  const [requestBody, setRequestBody] = useState('{}');
  const [responseData, setResponseData] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    fetchDocumentations();
    fetchSDKs();
  }, []);

  useEffect(() => {
    if (selectedDoc) {
      fetchExamples(selectedDoc.name, selectedDoc.version);
      fetchSchemas(selectedDoc.id);
    }
  }, [selectedDoc]);

  const fetchDocumentations = async () => {
    try {
      const response = await fetch('/api/documentation/api-docs?published=true');
      const data = await response.json();
      setDocumentations(data.documentations || []);
      if (data.documentations?.length > 0) {
        setSelectedDoc(data.documentations[0]);
      }
    } catch (error) {
      console.error('Failed to fetch documentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExamples = async (name: string, version: string) => {
    try {
      const response = await fetch(`/api/documentation/api-docs?name=${name}&version=${version}`);
      const data = await response.json();
      if (data.documentations?.[0]?.examples) {
        setExamples(data.documentations[0].examples);
      }
    } catch (error) {
      console.error('Failed to fetch examples:', error);
    }
  };

  const fetchSchemas = async (docId: string) => {
    try {
      const response = await fetch(`/api/documentation/api-docs?name=${selectedDoc?.name}&version=${selectedDoc?.version}`);
      const data = await response.json();
      if (data.documentations?.[0]?.schemas) {
        setSchemas(data.documentations[0].schemas);
      }
    } catch (error) {
      console.error('Failed to fetch schemas:', error);
    }
  };

  const fetchSDKs = async () => {
    try {
      const response = await fetch('/api/sdk-generation');
      const data = await response.json();
      setSDKs(data.sdks || []);
    } catch (error) {
      console.error('Failed to fetch SDKs:', error);
    }
  };

  const executeAPICall = async (endpoint: string, method: string, example?: APIExample) => {
    setIsExecuting(true);
    setResponseData(null);

    try {
      const url = `${baseUrl}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const requestOptions: RequestInit = {
        method,
        headers,
      };

      if (method !== 'GET' && requestBody) {
        requestOptions.body = requestBody;
      }

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      setResponseData({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data
      });
    } catch (error) {
      setResponseData({
        error: true,
        message: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateCurlCommand = (endpoint: string, method: string) => {
    let curl = `curl -X ${method}`;
    
    if (apiKey) {
      curl += ` -H "Authorization: Bearer ${apiKey}"`;
    }
    
    curl += ` -H "Content-Type: application/json"`;
    
    if (method !== 'GET' && requestBody && requestBody !== '{}') {
      curl += ` -d '${requestBody}'`;
    }
    
    curl += ` "${baseUrl}${endpoint}"`;
    
    return curl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Explorer</h1>
          <p className="text-gray-600 mt-1">Interactive API documentation, testing, and SDK downloads</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedDoc?.id || ''} onValueChange={(value) => {
            const doc = documentations.find(d => d.id === value);
            setSelectedDoc(doc || null);
          }}>
            {documentations.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title} v{doc.version}
              </option>
            ))}
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Collection
          </Button>
        </div>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>API Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
              <Input
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.re-commerce.se/v1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="playground">API Playground</TabsTrigger>
          <TabsTrigger value="schemas">Schemas</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
        </TabsList>

        {/* Documentation Tab */}
        <TabsContent value="documentation" className="space-y-6">
          {selectedDoc && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedDoc.title}</CardTitle>
                <CardDescription>{selectedDoc.description}</CardDescription>
                <div className="flex items-center space-x-4 pt-2">
                  <Badge>Version {selectedDoc.version}</Badge>
                  <Badge className="bg-green-100 text-green-800">
                    <Globe className="h-3 w-3 mr-1" />
                    {selectedDoc.schemes.join(', ')}
                  </Badge>
                  {selectedDoc.authTypes.map((auth) => (
                    <Badge key={auth} variant="outline">{auth}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Code Examples */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Code Examples
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                          <option value="curl">cURL</option>
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="php">PHP</option>
                          <option value="java">Java</option>
                        </Select>
                      </div>

                      {examples
                        .filter(ex => ex.language === selectedLanguage)
                        .map((example) => (
                          <Card key={example.id} className="border-l-4 border-l-blue-500">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg">{example.title}</CardTitle>
                                  <CardDescription>{example.description}</CardDescription>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge variant="outline">{example.method}</Badge>
                                    <Badge variant="outline">{example.endpointPath}</Badge>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(example.code)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                <code>{example.code}</code>
                              </pre>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* API Playground Tab */}
        <TabsContent value="playground" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Terminal className="h-5 w-5" />
                  <span>Request</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select defaultValue="GET">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </Select>
                  <Input placeholder="/users" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Body</label>
                  <Textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    placeholder="Enter JSON request body..."
                    className="font-mono text-sm"
                    rows={6}
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => executeAPICall('/users', 'GET')}
                  disabled={isExecuting}
                >
                  {isExecuting ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Send Request
                </Button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">cURL Command</label>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{generateCurlCommand('/users', 'GET')}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(generateCurlCommand('/users', 'GET'))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Response</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {responseData ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      {responseData.error ? (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {responseData.status} {responseData.statusText}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Response Body</label>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                        <code>{JSON.stringify(responseData, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Send a request to see the response here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Schemas Tab */}
        <TabsContent value="schemas" className="space-y-6">
          <div className="grid gap-6">
            {schemas.map((schema) => (
              <Card key={schema.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Layers className="h-5 w-5" />
                    <span>{schema.schemaName}</span>
                    <Badge variant="outline">{schema.schemaType}</Badge>
                  </CardTitle>
                  {schema.description && (
                    <CardDescription>{schema.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Properties</h4>
                      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{JSON.stringify(schema.properties, null, 2)}</code>
                      </pre>
                    </div>
                    {schema.example && (
                      <div>
                        <h4 className="font-medium mb-3">Example</h4>
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{JSON.stringify(schema.example, null, 2)}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                  {schema.required.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Required Fields</h4>
                      <div className="flex flex-wrap gap-2">
                        {schema.required.map((field) => (
                          <Badge key={field} className="bg-red-100 text-red-800">{field}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* SDKs Tab */}
        <TabsContent value="sdks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdks.map((sdk) => (
              <Card key={sdk.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{sdk.language}</span>
                    <Badge className="bg-green-100 text-green-800">{sdk.status}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {sdk.packageName} v{sdk.packageVersion}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Downloads:</span>
                      <span className="font-medium">{sdk.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(sdk.lastGenerated).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Book className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
