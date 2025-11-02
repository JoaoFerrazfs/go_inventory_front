import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Racks from "./pages/Racks";
import NewRack from "./pages/NewRack";
import RackDetails from "./pages/RackDetails";
import PalletDetails from "./pages/PalletDetails";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header comum */}
        <header className="bg-blue-900 text-white p-4">
          <h1 className="text-2xl font-bold">Go Inventory</h1>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/racks" element={<Racks />} />
            <Route path="/racks/novo" element={<NewRack />} />
            <Route path="/racks/:id" element={<RackDetails />} />
            <Route path="/pallets/:id" element={<PalletDetails />} />
          </Routes>
        </main>

        {/* Footer comum */}
        <footer className="bg-blue-900 text-white text-center py-4 mt-auto">
          <p>&copy; 2025 Go Inventory. Todos os direitos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
