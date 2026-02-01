import { AlertCircle, Github, Server, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DeploymentInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            🚗 Lead Management System
          </h1>
          <p className="text-lg text-gray-600">
            Frontend Successfully Deployed on Vercel!
          </p>
        </div>

        {/* Status Card */}
        <Card className="border-2 border-yellow-400 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-6 h-6" />
              Backend API Not Connected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              The frontend is deployed and working, but the backend API needs to be deployed separately.
              Follow the steps below to complete the deployment.
            </p>
          </CardContent>
        </Card>

        {/* Deployment Steps */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Github className="w-5 h-5" />
                Step 1: Frontend ✅
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Frontend deployed on Vercel successfully!
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Server className="w-5 h-5" />
                Step 2: Backend API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                Deploy the backend API to:
              </p>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• Railway.app</li>
                <li>• Render.com</li>
                <li>• Heroku</li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Database className="w-5 h-5" />
                Step 3: Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                Set up PostgreSQL:
              </p>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• Supabase</li>
                <li>• Railway</li>
                <li>• Neon</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📖 Deployment Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Deploy Backend API</h3>
              <p className="text-sm text-gray-600 mb-2">
                Go to Railway.app (recommended) or Render.com:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Connect your GitHub repository</li>
                <li>• Select the <code className="bg-gray-100 px-1 rounded">apps/api</code> directory</li>
                <li>• Add environment variables (DATABASE_URL, JWT_SECRET, etc.)</li>
                <li>• Deploy</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Set Up Database</h3>
              <p className="text-sm text-gray-600 mb-2">
                Create a PostgreSQL database on Supabase or Railway:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Get the connection string</li>
                <li>• Add it as DATABASE_URL in your API environment</li>
                <li>• Run migrations: <code className="bg-gray-100 px-1 rounded">npx prisma migrate deploy</code></li>
                <li>• Seed database: <code className="bg-gray-100 px-1 rounded">npx prisma db seed</code></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Update Frontend Environment</h3>
              <p className="text-sm text-gray-600 mb-2">
                In Vercel project settings:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Go to Settings → Environment Variables</li>
                <li>• Update <code className="bg-gray-100 px-1 rounded">VITE_API_URL</code> to your deployed API URL</li>
                <li>• Redeploy the frontend</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Link */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-gray-700">
              📚 For detailed instructions, see{' '}
              <a
                href="https://github.com/LorillaJm/-Leads-Managment/blob/main/VERCEL_DEPLOYMENT.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                VERCEL_DEPLOYMENT.md
              </a>
              {' '}in the repository
            </p>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card>
          <CardHeader>
            <CardTitle>✨ Features (Once Backend is Connected)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">For Admins:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• User Management</li>
                  <li>• All Leads Overview</li>
                  <li>• Performance Analytics</li>
                  <li>• Sales Rankings</li>
                  <li>• Closed Deals Tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">For Sales Consultants:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Personal Dashboard</li>
                  <li>• Lead Management</li>
                  <li>• Activity Tracking</li>
                  <li>• Peer Rankings</li>
                  <li>• Closed Deals</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Built with React, TypeScript, Node.js, and PostgreSQL</p>
          <p className="mt-1">
            <a
              href="https://github.com/LorillaJm/-Leads-Managment"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
