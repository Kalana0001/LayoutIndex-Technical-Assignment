import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import ProductPage from './pages/ProductPage/ProductPage';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/products" element={<ProductPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
