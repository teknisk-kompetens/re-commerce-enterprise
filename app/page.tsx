
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-6">
            <span className="text-2xl font-bold text-white">RE</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Re-Commerce Enterprise Suite
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete enterprise platform with AI-powered analytics, advanced security
            monitoring, performance optimization, and seamless integration ecosystem for
            modern businesses.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mt-4">
            DAG 4 ENTERPRISE TRANSFORMATION COMPLETE
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 dark:text-blue-400">👥</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">1,520</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 dark:text-green-400">🚀</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">94</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 dark:text-purple-400">✅</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">4,567</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-yellow-600 dark:text-yellow-400">⚡</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">98.9%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">System Health</div>
          </div>
        </div>

        {/* Enterprise Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            DAG 4 Complete Enterprise Features
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Advanced AI-powered capabilities, enterprise security, performance
            optimization, and seamless integrations
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 dark:text-blue-400 text-xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered Analytics
            </h3>
            <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">DAG 4</span>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Advanced machine learning algorithms for predictive analytics and intelligent insights.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 dark:text-green-400 text-xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Advanced Analytics
            </h3>
            <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">ENHANCED</span>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Real-time data processing with advanced visualization and reporting capabilities.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-red-600 dark:text-red-400 text-xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Security & Compliance
            </h3>
            <span className="inline-flex px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">DAG 4</span>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Enterprise-grade security with compliance monitoring and threat detection.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Launch Enterprise Dashboard
          </button>
          <button className="ml-4 bg-transparent border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
            Explore AI Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
