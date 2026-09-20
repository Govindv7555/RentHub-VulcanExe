import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  
  // Phone State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  
  // Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setStep(2);
  };

  const executeLogin = () => {
    login({
      id: 'demo_user',
      name: 'Jane Smith',
      phone: phone || '(555) 000-0000',
      kyc_verified: false
    }, 'mock_jwt_token');
    navigate('/');
  };

  const handleVerifyPhone = (e) => {
    e.preventDefault();
    if (otp !== '123456') {
      alert("For demo, use OTP 123456");
      return;
    }
    executeLogin();
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    executeLogin();
  };
  
  const handleGoogleLogin = () => {
    executeLogin();
  };

  return (
    <div className="flex-1 bg-background flex flex-col justify-center items-center p-4">
      <div className="card w-full max-w-md p-8 md:p-10 relative overflow-hidden">
        {/* Amber accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to <span className="text-white">RENT</span><span className="text-amber">HUB</span>
          </h2>
          <p className="text-textMuted text-sm">
            Login or sign up to continue
          </p>
        </div>

        {/* Auth Method Tabs */}
        {step === 1 && (
          <div className="flex space-x-4 mb-6 border-b border-surfaceLight">
             <button 
               className={`pb-2 text-sm font-semibold flex-1 ${authMethod === 'phone' ? 'text-amber border-b-2 border-amber' : 'text-textMuted hover:text-white transition-colors'}`}
               onClick={() => setAuthMethod('phone')}
             >Phone</button>
             <button 
               className={`pb-2 text-sm font-semibold flex-1 ${authMethod === 'email' ? 'text-amber border-b-2 border-amber' : 'text-textMuted hover:text-white transition-colors'}`}
               onClick={() => setAuthMethod('email')}
             >Email</button>
          </div>
        )}

        {/* PHONE FLOW */}
        {authMethod === 'phone' && (
          <>
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-6 animate-fade-in-up">
                <div>
                  <label className="text-xs uppercase tracking-widest text-textMuted font-semibold mb-2 block">
                    Phone Number
                  </label>
                  <div className="flex">
                    <div className="bg-surfaceLight border border-surfaceLight rounded-l px-4 py-3 text-white flex items-center shrink-0">
                      +1
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field rounded-l-none w-full border-l-0 py-3 text-lg" 
                      placeholder="(555) 000-0000"
                      autoFocus
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn-primary w-full py-3" disabled={phone.length < 10}>
                  Send Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhone} className="space-y-6 animate-fade-in-up">
                <p className="text-textMuted text-sm text-center mb-4">Enter the verification code sent to your phone</p>
                <div>
                  <label className="text-xs uppercase tracking-widest text-textMuted font-semibold mb-2 block">
                    Verification Code
                  </label>
                  <input 
                    type="text" 
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="input-field w-full py-3 text-center text-2xl tracking-[0.5em] font-mono" 
                    placeholder="------"
                    autoFocus
                  />
                  <p className="text-xs text-amber text-center mt-2">Demo OTP: 123456</p>
                </div>
                
                <button type="submit" className="btn-primary w-full py-3" disabled={otp.length < 6}>
                  Verify & Login
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-full text-textMuted text-xs uppercase tracking-widest mt-4 hover:text-white transition-colors"
                >
                  Back
                </button>
              </form>
            )}
          </>
        )}

        {/* EMAIL FLOW */}
        {authMethod === 'email' && step === 1 && (
           <form onSubmit={handleEmailLogin} className="space-y-6 animate-fade-in-up">
              <div>
                <label className="text-xs uppercase tracking-widest text-textMuted font-semibold mb-2 block">
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full py-3 text-sm" 
                  placeholder="jane@example.com"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-textMuted font-semibold mb-2 block">
                  Password
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full py-3 text-sm" 
                  placeholder="••••••••"
                />
              </div>
              
              <button type="submit" className="btn-primary w-full py-3" disabled={!email || !password}>
                Log In
              </button>
           </form>
        )}
        
        {/* GOOGLE OAUTH */}
        {step === 1 && (
           <div className="mt-6 pt-6 border-t border-surfaceLight animate-fade-in-up">
              <button 
                onClick={handleGoogleLogin} 
                className="w-full bg-white text-black font-semibold py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
              >
                 <svg viewBox="0 0 24 24" className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                 </svg>
                 Continue with Google
              </button>
           </div>
        )}
        
      </div>
    </div>
  );
}
