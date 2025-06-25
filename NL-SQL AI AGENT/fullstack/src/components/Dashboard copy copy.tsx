import React from 'react';
import { LogOut, User, Database, BarChart3, Settings, Bell } from 'lucide-react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const stats = [
    { label: 'Total Queries', value: '1,234', icon: Database, color: 'bg-blue-500' },
    { label: 'Success Rate', value: '98.5%', icon: BarChart3, color: 'bg-green-500' },
    { label: 'Avg Response Time', value: '1.2s', icon: Settings, color: 'bg-purple-500' },
    { label: 'Active Sessions', value: '12', icon: Bell, color: 'bg-orange-500' }
  ];

  const recentQueries = [
    { query: 'Show me top 5 customers by revenue', time: '2 minutes ago', status: 'success' },
    { query: 'What are the sales trends for Q4?', time: '5 minutes ago', status: 'success' },
    { query: 'List all products with low inventory', time: '10 minutes ago', status: 'success' },
    { query: 'Calculate monthly recurring revenue', time: '15 minutes ago', status: 'success' },
    { query: 'Show customer churn rate by region', time: '20 minutes ago', status: 'success' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NL-SQL Dashboard
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user.firstName}!</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/50 rounded-xl border border-gray-200/50">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to your NL-SQL Dashboard</h2>
          <p className="text-blue-100 mb-6">
            Transform your natural language questions into powerful SQL queries and get instant insights from your data.
          </p>
          <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm">
            Start New Query
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center justify-center w-12 h-12 ${stat.color} rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Queries</h3>
          <div className="space-y-4">
            {recentQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-all duration-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{query.query}</p>
                  <p className="text-sm text-gray-600">{query.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Success
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}