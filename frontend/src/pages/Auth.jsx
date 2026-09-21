import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showKycPopup, setShowKycPopup] = useState(false);
  const [error, setError] = useState('');

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (email === 'janesmith@gmail.com' && password === 'password123') {
      login({
        id: 'demo_user',
        name: 'Jane Smith',
        phone: '9876543210',
        kyc_verified: false,
        purchases_count: 6,
        reputation_score: 75,
        password: 'password123'
      }, 'mock_jwt_token');
      setShowKycPopup(true);
    } else {
      setError('Invalid credentials. Use janesmith@gmail.com / password123');
    }
  };

  const handleCancelKyc = () => {
    logout();
    navigate('/');
  };

  const handleOkKyc = () => {
    navigate('/kyc');
  };

  return (
    <div className="flex-1 bg-background flex flex-col justify-center items-center p-4 py-20">
      <div className="card w-full max-w-md p-8 md:p-10 relative overflow-hidden">
        {/* Amber accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-sm text-textMuted">Log in to manage your rentals.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleEmailLogin} className="space-y-6 animate-fade-in-up">
          <div>
            <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full py-3" 
              placeholder="e.g. janesmith@gmail.com"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full py-3" 
              placeholder="e.g. password123"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3">Sign In</button>
        </form>
      </div>

      {/* KYC Alert Popup */}
      {showKycPopup && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-surfaceLight rounded-lg w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-6 text-center">
               <ShieldAlert size={48} className="mx-auto text-amber mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">Profile Incomplete</h3>
               <p className="text-sm text-textMuted mb-6">You must complete KYC verification before using RentHub.</p>
            </div>
            <div className="flex border-t border-surfaceLight bg-background p-4 gap-4">
               <button onClick={handleCancelKyc} className="btn-outline flex-1 pointer-events-auto">Cancel</button>
               <button onClick={handleOkKyc} className="btn-primary flex-1 pointer-events-auto">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
