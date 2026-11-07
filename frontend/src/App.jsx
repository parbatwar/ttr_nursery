import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import WhatsAppButton from "./components/WhatsAppButton";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Services from "./pages/Services";
// About page is hidden for now. To bring it back, restore this import and its route,
// then add the links back in Navbar.jsx and Footer.jsx.
// import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import OrderStatus from "./pages/OrderStatus";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        {children}
      </main>

      <Footer />

      <WhatsAppButton />

      <CartDrawer />
    </>
  );
}

function App() {
  return (
      <Routes>
        {/* Pages WITH Navbar & Footer */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/products"
          element={
            <MainLayout>
              <Products />
            </MainLayout>
          }
        />

        <Route
          path="/products/:slug"
          element={
            <MainLayout>
              <ProductDetail />
            </MainLayout>
          }
        />

        <Route
          path="/services"
          element={
            <MainLayout>
              <Services />
            </MainLayout>
          }
        />

        {/* Hidden for now.
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        */}

        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />

        <Route
          path="/orders/:accessToken"
          element={
            <MainLayout>
              <OrderStatus />
            </MainLayout>
          }
        />

        <Route path="/account" element={<MainLayout><Account /></MainLayout>} />

        {/* Pages WITHOUT Navbar & Footer */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
  );
}

export default App;
