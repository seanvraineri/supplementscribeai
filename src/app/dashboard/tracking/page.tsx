import DynamicTracker from '@/components/DynamicTracker';

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              AI-Powered Health Tracking
            </h1>
            <p className="text-zinc-400 text-lg">
              Personalized questions generated just for you based on your health profile
            </p>
          </div>
          
          <DynamicTracker />
        </div>
      </div>
    </div>
  );
} 