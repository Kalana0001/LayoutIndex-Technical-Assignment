import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import ProductPage from './pages/ProductPage/ProductPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AdminPanel />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
