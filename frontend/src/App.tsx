import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">PERN Frontend</h1>
        <p className="text-gray-600 mb-6">
          Welcome to the PERN stack frontend application!
        </p>
        <div className="space-y-4">
          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Count: {count}
          </button>
          <div>
            <p className="text-sm text-gray-500">
              Backend API:{' '}
              <span className="font-mono">http://localhost:3000</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
