import { PWAInstallPrompt } from "../components/PWAInstallPrompt";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">PeeBuddy</h1>
          <p className="text-lg text-gray-600">Une app pour faire pipi</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">PWA Ready</span>
          </div>

          <p className="text-sm text-gray-500">
            Cette application peut être installée sur votre appareil pour une
            expérience optimale.
          </p>
        </div>
      </div>

      <PWAInstallPrompt />
    </div>
  );
}
