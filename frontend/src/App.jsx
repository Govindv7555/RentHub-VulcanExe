import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import Chat from './pages/Chat';

// Placeholder pages for early build
const PlaceholderPage = ({ title }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
    <p className="text-textMuted max-w-md text-center">This page is currently being built. Check back soon for updates.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <div className="flex-1 flex flex-col w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contacts" element={<Contact />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
