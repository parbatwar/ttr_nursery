import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";

function Products() {
  return <div className="p-10">Products</div>;
}

function Cart() {
  return <div className="p-10">Cart</div>;
}

function Login() {
  return <div className="p-10">Login</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[var(--ttr-bg)]">
        <Navbar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}