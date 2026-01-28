import { useEffect, useState } from 'react';
import { initDatabase } from './db/database';
import { seedDatabase, clearDatabase } from './db/seed';
import WeeklyView from './components/WeeklyView/WeeklyView';

function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbSeeded, setDbSeeded] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initDatabase();
        setDbInitialized(true);

        // Check if database has data
        const db = (await import('./db/database')).default;
        const docs = await db.allDocs({ limit: 1 });

        if (docs.rows.length > 0) {
          setDbSeeded(true);
        } else {
          setShowSetup(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      }
    }
    init();
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      setDbSeeded(true);
      setShowSetup(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearAndReseed = async () => {
    if (!confirm('This will delete all data and reseed the database. Continue?')) {
      return;
    }

    setIsSeeding(true);
    try {
      await clearDatabase();
      await seedDatabase();
      setDbSeeded(true);
      alert('Database cleared and reseeded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset database');
    } finally {
      setIsSeeding(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary mt-4"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  if (!dbInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing database...</p>
        </div>
      </div>
    );
  }

  if (showSetup || !dbSeeded) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-4 max-w-3xl">
          <header className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Suit Hire Management System</h1>
            <p className="text-gray-600 mt-2">Tablet-friendly PWA for suit rental bookings</p>
          </header>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Initial Setup</h2>
            <p className="text-gray-700 mb-4">
              Database initialized successfully! Click below to seed the database with initial inventory.
            </p>
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSeeding ? 'Seeding Database...' : 'Seed Database with Inventory'}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold mb-2">Initial Inventory:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 270 Suit Jackets (5 styles × 3 colours × various sizes)</li>
                <li>• 270 Trousers (matching suit inventory)</li>
                <li>• 100 Shirts (White/Black in sizes S-XXL)</li>
                <li>• 100 Ties (5 colours)</li>
                <li>• 100 Pocket Squares (5 colours)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Settings button (top right) */}
      <button
        onClick={() => setShowSetup(true)}
        className="fixed top-4 right-4 z-50 btn btn-secondary text-sm"
        title="Settings"
      >
        ⚙️ Settings
      </button>

      {/* Settings Overlay */}
      {showSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <button
                onClick={() => setShowSetup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Database</h3>
                <button
                  onClick={handleClearAndReseed}
                  disabled={isSeeding}
                  className="btn btn-danger w-full disabled:opacity-50"
                >
                  {isSeeding ? 'Resetting...' : 'Clear & Reseed Database'}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  This will delete all bookings and customers, and reset inventory to default.
                </p>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => setShowSetup(false)}
                  className="btn btn-secondary w-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main App */}
      <WeeklyView />
    </div>
  );
}

export default App;
