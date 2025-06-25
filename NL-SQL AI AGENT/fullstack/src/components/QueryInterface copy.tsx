import React, { useState } from 'react';
import { ArrowLeft, Send, Loader2, Database, CheckCircle, AlertCircle, Copy, Download } from 'lucide-react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  designation?: string;
  createdAt: string;
}

interface QueryInterfaceProps {
  user: User;
  onBack: () => void;
}

interface QueryResult {
  success: boolean;
  result?: string;
  error?: string;
  executionTime?: number;
  inputData?: any;
}

export default function QueryInterface({ user, onBack }: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [queryHistory, setQueryHistory] = useState<Array<{
    query: string;
    timestamp: string;
    success: boolean;
    result?: string;
  }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setResult(null);

    const startTime = Date.now();

    try {
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          question: query.trim()
        })
      });

      const data = await response.json();
      const executionTime = Date.now() - startTime;

      if (response.ok && data.success) {
        const queryResult = {
          success: true,
          result: data.result,
          executionTime: executionTime,
          inputData: data.inputData
        };
        
        setResult(queryResult);

        // Add to query history
        setQueryHistory(prev => [{
          query: query.trim(),
          timestamp: new Date().toLocaleString(),
          success: true,
          result: data.result
        }, ...prev.slice(0, 9)]);
      } else {
        const errorResult = {
          success: false,
          error: data.error || 'Query execution failed',
          executionTime: executionTime
        };
        
        setResult(errorResult);

        setQueryHistory(prev => [{
          query: query.trim(),
          timestamp: new Date().toLocaleString(),
          success: false
        }, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Query error:', error);
      setResult({
        success: false,
        error: 'Network error. Please check if the server is running.',
        executionTime: Date.now() - startTime
      });

      setQueryHistory(prev => [{
        query: query.trim(),
        timestamp: new Date().toLocaleString(),
        success: false
      }, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    "Show all product names and current stock levels from the inventory",
    "What are the top 5 selling products this month?",
    "List all customers who made purchases in the last 30 days",
    "Calculate the total revenue for each product category",
    "Show employees with their departments and salaries",
    "Find products with stock levels below 10 units",
    "Display monthly sales trends for the current year",
    "Show customer purchase history for high-value clients"
  ];

  const handleExampleClick = (exampleQuery: string) => {
    if (!loading) {
      setQuery(exampleQuery);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResult = () => {
    if (result?.result) {
      const blob = new Blob([result.result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `query-result-${new Date().toISOString().slice(0, 19)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl transition-all duration-200"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NL-SQL Query Interface
                </h1>
                <p className="text-sm text-gray-600">Ask questions in natural language</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Query Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query Input */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ask Your Question</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type your question in natural language... (e.g., 'Show me all customers who purchased more than $1000 worth of products')"
                    className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Query...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Go!
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Query Result */}
            {result && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">
                      {result.success ? 'Query Result' : 'Query Error'}
                    </h3>
                    {result.executionTime && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({result.executionTime}ms)
                      </span>
                    )}
                  </div>
                  
                  {result.success && result.result && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(result.result!)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={downloadResult}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title="Download result"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {result.success ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 overflow-auto max-h-96">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                        {result.result}
                      </pre>
                    </div>
                    {result.inputData && (
                      <div className="text-xs text-gray-500 bg-gray-100 rounded-lg p-3">
                        <strong>Query processed for:</strong> {result.inputData.user_email} ({result.inputData.designation})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 text-sm">{result.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Example Queries */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Example Queries</h3>
              <div className="space-y-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 text-sm text-gray-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Query History */}
            {queryHistory.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Queries</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {queryHistory.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all duration-200"
                      onClick={() => !loading && setQuery(item.query)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {item.success ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{item.query}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">User:</span>
                  <span className="text-gray-800">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-800 text-xs">{user.email}</span>
                </div>
                {user.designation && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="text-gray-800">{user.designation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}