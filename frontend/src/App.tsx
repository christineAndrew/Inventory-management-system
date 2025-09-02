// File: src/App.tsx
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter as Router } from 'react-router-dom';
import client from './api/client';
import Navigation from './components/Navigation';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main>
            <AppRoutes />
          </main>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
