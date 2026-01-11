import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SocketListener } from './context/SocketListener';
import NavBar from './components/NavBar';
import AppRoutes from './routes';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SocketListener>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <NavBar />
              <main>
                <AppRoutes />
              </main>
            </div>
          </Router>
        </SocketListener>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
