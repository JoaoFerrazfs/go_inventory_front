import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";
import Racks from "./pages/Racks";
import NewRack from "./pages/NewRack";
import RackDetails from "./pages/RackDetails";
import PalletDetails from "./pages/PalletDetails";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import UserManagement from "./pages/UserManagement";
import Pallets from "./pages/Pallets";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />

          {/* Conteúdo principal */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/racks"
                element={
                  <ProtectedRoute>
                    <Racks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/racks/novo"
                element={
                  <ProtectedRoute>
                    <NewRack />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/racks/:id"
                element={
                  <ProtectedRoute>
                    <RackDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pallets/:id"
                element={
                  <ProtectedRoute>
                    <PalletDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/pallets"
                element={
                  <ProtectedRoute>
                    <Pallets />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer comum */}
          <footer className="bg-blue-900 text-white text-center py-4 mt-auto">
            <p>&copy; 2025 Go Inventory. Todos os direitos reservados.</p>
          </footer>
        </div>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
