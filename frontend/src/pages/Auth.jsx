import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { ShieldAlert, X } from 'lucide-react';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [showKycPopup, setShowKycPopup] = useState(false);
  const [error, setError] = useState('');
  const [tempUser, setTempUser] = useState(null);

  const { loginUser, registerUser, attemptLogin, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (isSignUp) {
      const newUser = registerUser(email, password);
      if (!newUser) {
        setError('Email already exists. Please log in.');
        return;
      }
      setTempUser(newUser);
      loginUser({ ...newUser, kyc_verified: false });
      setShowTermsPopup(true);
    } else {
      const existingUser = attemptLogin(email, password);
      if (!existingUser) {
        setError('Invalid credentials.');
        return;
      }
      loginUser(existingUser);
      if (!existingUser.kyc_verified) {
        setTempUser(existingUser);
        setShowKycPopup(true);
      } else {
        navigate('/');
      }
    }
  };

  const handleCancelKyc = () => {
    logout();
    navigate('/');
  };

  const handleAcknowledgeTerms = () => {
    setShowTermsPopup(false);
    setShowKycPopup(true);
  };

  const handleOkKyc = () => {
    navigate('/kyc');
  };

  return (
    <div className="flex-1 bg-background flex flex-col justify-center items-center p-4 py-20">
      <div className="card w-full max-w-md p-8 md:p-10 relative overflow-hidden">
        {/* Amber accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber"></div>
        
        <div className="text-center mb-6 border-b border-surfaceLight flex">
          <button 
             type="button"
             onClick={() => { setIsSignUp(false); setError(''); }}
             className={cn("flex-1 pb-3 text-sm font-semibold transition-colors", !isSignUp ? "text-amber border-b-2 border-amber" : "text-textMuted hover:text-white")}
          >
             Sign In
          </button>
          <button 
             type="button"
             onClick={() => { setIsSignUp(true); setError(''); }}
             className={cn("flex-1 pb-3 text-sm font-semibold transition-colors", isSignUp ? "text-amber border-b-2 border-amber" : "text-textMuted hover:text-white")}
          >
             Sign Up
          </button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
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
              placeholder={isSignUp ? "Create a secure password" : "Your password"}
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3">{isSignUp ? "Sign Up" : "Sign In"}</button>
        </form>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-background border border-surfaceLight rounded-lg max-w-2xl w-full p-6 md:p-8 animate-fade-in-up relative">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">Terms & Conditions</h2>
              <button 
                onClick={() => {
                  setShowTermsPopup(false);
                  handleCancelKyc();
                }}
                className="text-textMuted hover:text-white transition-colors"
                title="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 text-sm text-white/80 leading-relaxed font-normal overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              <h3 className="text-amber font-semibold uppercase tracking-wider text-xs">Delivery Inspection and Damage</h3>
              <p>At the time of delivery, the customer must inspect the rented product in the presence of the RentHub delivery partner and verify its condition, functionality, accessories, and any visible damage before accepting the delivery.</p>
              <p>The customer may report any issue immediately to the delivery partner before confirming receipt. Once the customer completes the inspection, confirms acceptance, and provides the required delivery PIN/OTP, the product will be considered accepted in the condition observed at the time of delivery.</p>
              <p>After the delivery is completed and the delivery partner leaves, the customer is responsible for the product throughout the rental period. Any damage, loss, missing accessories, or misuse occurring after acceptance may be the customer's responsibility, subject to the applicable rental agreement, documented pre-existing defects, normal wear and tear, and applicable law.</p>
              <p className="text-amber/90 font-medium bg-amber/10 p-3 border-l-2 border-amber">Customers are strongly advised to take photographs or videos of the product at the time of delivery for their records.</p>
            </div>
            <div className="mt-8 pt-6 border-t border-surfaceLight flex justify-end">
               <button onClick={handleAcknowledgeTerms} className="btn-primary px-8">Acknowledge</button>
            </div>
          </div>
        </div>
      )}

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
