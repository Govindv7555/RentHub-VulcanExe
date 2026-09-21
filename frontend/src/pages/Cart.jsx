import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, ArrowRight, ArrowLeft, Trash2, CheckCircle, MapPin, Camera, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

const steps = [
  'Items & Delivery', 'Safety Deposit', 'Item Validation', 'Final Payment'
];

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, subtotal } = useCart();
  const { user, validatePassword } = useAuth();
  const navigate = useNavigate();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // State Persistence — tie to user session
  const [currentStep, setCurrentStep] = useState(0);

  // Load user's saved step on auth change
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`cart_step_${user.id}`);
      if (saved) setCurrentStep(parseInt(saved, 10));
    } else {
      setCurrentStep(0);
    }
  }, [user]);

  // Save step changes if logged in
  useEffect(() => {
    if (user && cartItems.length > 0) {
      localStorage.setItem(`cart_step_${user.id}`, currentStep);
    } else if (user && cartItems.length === 0) {
      setCurrentStep(0);
      localStorage.removeItem(`cart_step_${user.id}`);
    }
  }, [currentStep, cartItems, user]);

  const systemDate = new Date(); // Sept 21 2026 based on meta constraints
  systemDate.setHours(0,0,0,0);
  
  const currentMonthName = systemDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(systemDate.getFullYear(), systemDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(systemDate.getFullYear(), systemDate.getMonth(), 1).getDay();
  const startEmptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevDaysArr = Array.from({length: startEmptySlots}).map((_, i) => new Date(systemDate.getFullYear(), systemDate.getMonth(), 0).getDate() - startEmptySlots + i + 1);
  const currentDaysArr = Array.from({length: daysInMonth}).map((_, i) => i + 1);
  
  const totalCells = startEmptySlots + daysInMonth;
  const nextDaysArr = Array.from({length: Math.ceil(totalCells / 7) * 7 - totalCells}).map((_, i) => i + 1);

  const [dateRange, setDateRange] = useState({ 
    start: systemDate, 
    end: new Date(systemDate.getFullYear(), systemDate.getMonth(), systemDate.getDate() + 2),
    startTime: 'Afternoon (2-5 PM)',
    endTime: 'Midday (10-2 PM)'
  });

  const handleDateClick = (day) => {
    const selectedDate = new Date(systemDate.getFullYear(), systemDate.getMonth(), day);
    if(selectedDate < systemDate) return; 
    
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
       setDateRange({ ...dateRange, start: selectedDate, end: null });
    } else if (selectedDate <= dateRange.start) {
       setDateRange({ ...dateRange, start: selectedDate, end: null });
    } else {
       setDateRange({ ...dateRange, end: selectedDate });
    }
  };

  const calculateDuration = () => {
    if(!dateRange.start || !dateRange.end) return 1;
    const mapDiff = Math.abs(dateRange.end - dateRange.start);
    return Math.ceil(mapDiff / (1000 * 60 * 60 * 24)) + 1;
  };

  const [deliveryLocation, setDeliveryLocation] = useState('New Delhi, DL');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

  // Dynamic Safety Deposit Logic
  const getTrustPercentage = () => {
    if (!user || (user.transactions_count || 0) < 5) return 0;
    return (user.rating_avg / 5) * 100;
  };

  const getSafetyDepositPercentage = () => {
    const trustPercent = getTrustPercentage();
    if (trustPercent < 80) return 5;
    return 10;
  };

  const totalSafetyDeposit = cartItems.reduce((acc, item) => {
    const pct = getSafetyDepositPercentage();
    const duration = calculateDuration() || 1;
    const totalRevenue = (item.price_per_day_paise / 100) * duration;
    return acc + (totalRevenue * (pct / 100));
  }, 0);

  // Constants
  const T = cartItems.length ? 245.31 : 0; // Tax
  const deliveryFee = cartItems.length ? 321.12 : 0; // Delivery
  const totalFees = subtotal + T + deliveryFee + totalSafetyDeposit;

  const handleNextStep = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setCurrentStep(s => s + 1);
    window.scrollTo(0, 0);
  };

  const handlePayment = () => {
    if (!validatePassword(password)) {
      setPasswordError('Incorrect password. Please try again.');
      return;
    }
    setPasswordError('');
    setPassword('');
    handleNextStep();
  };

  const handleReturnDamaged = () => {
    alert("Return initiated. Safety Deposit of ₹" + totalSafetyDeposit.toFixed(2) + " is refunded instantly.");
    clearCart();
    if (user) localStorage.removeItem(`cart_step_${user.id}`);
    navigate('/');
  };

  return (
    <div className="flex-1 bg-surface pt-8 pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Step Indicator */}
        <div className="flex flex-wrap items-center justify-between md:justify-start md:space-x-12 mb-12 overflow-x-auto pb-4 border-b border-surfaceLight">
          {steps.map((label, idx) => (
            <div key={idx} className={cn(
              "flex items-center space-x-2 shrink-0 mb-2 md:mb-0",
              currentStep === idx ? "text-amber font-semibold" : 
              currentStep > idx ? "text-white/70" : "text-white/30"
            )}>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                currentStep === idx ? "bg-amber text-black" : 
                currentStep > idx ? "bg-white/20 text-white" : "bg-white/10 text-white/50"
              )}>
                {currentStep > idx ? <CheckCircle size={14} /> : (idx + 1)}
              </div>
              <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        {cartItems.length === 0 && currentStep === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-textMuted mb-8">Add some equipment from the catalog to get started.</p>
            <Link to="/catalog" className="btn-primary">Browse Catalog</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Flow */}
            <div className="flex-1">
              
              {/* STEP 1: Items & Delivery Config */}
              {currentStep === 0 && (
                <div className="animate-fade-in-up">
                  <h2 className="text-2xl font-bold text-white mb-6">Delivery Details</h2>
                  
                  <div className="bg-background p-6 rounded-lg border border-surfaceLight mb-6">
                    <label className="text-[10px] text-textMuted uppercase font-bold mb-3 block">Preferred Delivery Location</label>
                    <div className="relative">
                      <input 
                         type="text" 
                         value={deliveryLocation}
                         onChange={(e) => setDeliveryLocation(e.target.value)}
                         className="input-field w-full pl-10" 
                         placeholder="Enter location e.g. New Delhi, DL" 
                      />
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 bg-background p-6 rounded-lg border border-surfaceLight">
                    {/* Interactive Calendar Mock */}
                    <div className="flex-1 border-r-0 md:border-r border-surfaceLight md:pr-8">
                       <div className="flex justify-between items-center mb-4">
                         <button className="text-textMuted hover:text-white"><ArrowLeft size={16}/></button>
                         <span className="font-semibold text-white text-sm">{currentMonthName}</span>
                         <button className="text-textMuted hover:text-white"><ArrowRight size={16}/></button>
                       </div>
                       
                       <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center text-[10px] mb-2 text-textMuted uppercase font-semibold">
                         <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                       </div>
                       
                       <div className="grid grid-cols-7 gap-1 text-center text-sm text-white">
                          {prevDaysArr.map(d => <div key={'prev'+d} className="p-2 text-white/20">{d}</div>)}
                          {currentDaysArr.map(d => {
                            const thisDate = new Date(systemDate.getFullYear(), systemDate.getMonth(), d);
                            const isPast = thisDate < systemDate;
                            
                            const isStart = dateRange.start && thisDate.getTime() === dateRange.start.getTime();
                            const isEnd = dateRange.end && thisDate.getTime() === dateRange.end.getTime();
                            const isBetween = dateRange.start && dateRange.end && thisDate > dateRange.start && thisDate < dateRange.end;
                            const isEdge = isStart && isEnd;
                            
                            return (
                              <div 
                                key={d} 
                                onClick={() => !isPast && handleDateClick(d)}
                                className={cn(
                                  "p-2 rounded cursor-pointer transition-colors font-bold relative",
                                  isPast && "text-white/20 hover:bg-transparent font-normal cursor-not-allowed",
                                  !isPast && !isStart && !isEnd && !isBetween && "hover:bg-white/10 font-normal",
                                  isStart && !isEdge && "bg-amber text-black rounded-r-none",
                                  isEnd && !isEdge && "bg-amber text-black rounded-l-none border-l border-black/10",
                                  isEdge && "bg-amber text-black",
                                  isBetween && "bg-amber/20 text-white rounded-none font-normal"
                                )}
                              >
                                {d}
                              </div>
                            );
                          })}
                          {nextDaysArr.map(d => <div key={'next'+d} className="p-2 text-white/20">{d}</div>)}
                       </div>
                       <p className="mt-6 text-sm font-bold text-white tracking-tight border-t border-surfaceLight pt-4">Duration: {calculateDuration()} Days</p>
                    </div>

                    <div className="flex-1 space-y-6">
                       <div>
                         <label className="text-[10px] text-textMuted uppercase font-bold mb-2 block">Rental Start</label>
                         <input type="text" value={dateRange.start ? dateRange.start.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric'}) : '--'} readOnly className="input-field w-full text-white font-medium bg-surface text-sm" />
                       </div>
                       <div>
                         <label className="text-[10px] text-textMuted uppercase font-bold mb-2 block">Rental End</label>
                         <input type="text" value={dateRange.end ? dateRange.end.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric'}) : '--'} readOnly className="input-field w-full text-white font-medium bg-surface text-sm" />
                       </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                     <button onClick={handleNextStep} className="btn-primary px-12">CONTINUE</button>
                  </div>
                </div>
              )}

              {/* STEP 2: Safety Deposit Payment */}
              {currentStep === 1 && (
                <div className="animate-fade-in-up space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Safety Deposit Phase</h2>
                  <div className="bg-amber/10 border border-amber/30 p-4 rounded text-sm text-white/80">
                     <p className="mb-2"><strong>Smart Deposit Calculation:</strong> Because you have {user?.transactions_count || 0} past transactions and a Trust Percentage of {getTrustPercentage()}%, your safety deposit is set to {getSafetyDepositPercentage()}% of total rental revenue.</p>
                  </div>

                  <div className="bg-background p-6 rounded-lg border border-surfaceLight">
                     <div className="flex justify-between items-end mb-6 border-b border-surfaceLight pb-6">
                       <div>
                         <h3 className="font-bold text-white mb-1">Deposit Due Now</h3>
                         <p className="text-xs text-textMuted">Fully refundable upon safe return</p>
                       </div>
                       <span className="text-3xl font-bold text-white">₹{totalSafetyDeposit.toFixed(2)}</span>
                     </div>

                     <div className="space-y-4 mb-8">
                       <label className="text-[10px] text-textMuted uppercase font-bold mb-2 block">Payment Method</label>
                       <div className="flex gap-4">
                         <button onClick={() => setPaymentMethod('card')} className={cn("flex-1 py-3 border rounded text-xs font-bold uppercase tracking-wider transition-colors", paymentMethod === 'card' ? "border-amber bg-amber/10 text-amber" : "border-surfaceLight text-textMuted hover:text-white")}>Card</button>
                         <button onClick={() => setPaymentMethod('upi')} className={cn("flex-1 py-3 border rounded text-xs font-bold uppercase tracking-wider transition-colors", paymentMethod === 'upi' ? "border-amber bg-amber/10 text-amber" : "border-surfaceLight text-textMuted hover:text-white")}>UPI</button>
                         <button onClick={() => setPaymentMethod('net')} className={cn("flex-1 py-3 border rounded text-xs font-bold uppercase tracking-wider transition-colors", paymentMethod === 'net' ? "border-amber bg-amber/10 text-amber" : "border-surfaceLight text-textMuted hover:text-white")}>Net Banking</button>
                       </div>
                     </div>

                     <div className="pt-6 border-t border-surfaceLight">
                       <label className="text-[10px] text-textMuted uppercase font-bold mb-2 block">Security Verification</label>
                       <p className="text-xs text-textMuted mb-3">Re-enter your RentHub password to authorize the temporary deposit hold.</p>
                       <input 
                          type="password" 
                          value={password} 
                          onChange={e => setPassword(e.target.value)} 
                          placeholder="Password" 
                          className="input-field w-full mb-2" 
                       />
                       {passwordError && <p className="text-xs text-red-500 mb-4">{passwordError}</p>}
                       <button onClick={handlePayment} className="btn-primary w-full py-3 mt-4" disabled={!password}>Authorize ₹{totalSafetyDeposit.toFixed(2)} Hold</button>
                     </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Item Validation (Delivery) */}
              {currentStep === 2 && (
                <div className="animate-fade-in-up space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Item Delivered</h2>
                  <p className="text-textMuted text-sm mb-6">Inspect the item and upload a validation photo for the owner.</p>

                  <div className="bg-background p-6 rounded-lg border border-surfaceLight text-center">
                    {!isPhotoUploaded ? (
                      <div className="border-2 border-dashed border-surfaceLight hover:border-amber/50 transition-colors rounded-lg bg-surface/50 h-48 flex flex-col items-center justify-center cursor-pointer mb-6" onClick={() => setIsPhotoUploaded(true)}>
                        <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-3">
                          <Camera size={20} className="text-textMuted" />
                        </div>
                        <p className="font-semibold text-white text-sm">Click to upload arrival photo</p>
                      </div>
                    ) : (
                      <div className="border border-green-500/30 bg-green-500/10 rounded-lg p-6 mb-6 flex flex-col items-center">
                        <CheckCircle size={32} className="text-green-500 mb-2" />
                        <p className="text-white font-bold">Photo verified</p>
                      </div>
                    )}

                    <div className={cn("grid grid-cols-2 gap-4 transition-opacity duration-500", isPhotoUploaded ? 'opacity-100' : 'opacity-30 pointer-events-none')}>
                       <button onClick={handleNextStep} className="btn-primary py-3 rounded text-xs gap-2 flex items-center justify-center">
                         <ShieldCheck size={16} /> Item is in Good Condition
                       </button>
                       <button onClick={handleReturnDamaged} className="bg-red-500/10 text-red-500 border border-red-500/30 font-bold uppercase tracking-wider py-3 rounded text-xs hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                         <AlertTriangle size={16} /> Item Damaged, Return Now
                       </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Final Payment */}
              {currentStep === 3 && (
                <div className="animate-fade-in-up space-y-6 text-center">
                   <div className="pt-10 pb-6 flex flex-col items-center">
                      <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                         <CheckCircle size={40} />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">Rental Successful!</h2>
                      <p className="text-textMuted max-w-sm mx-auto">Your rental period has concluded. Safety deposit has been released. Please pay the final balance.</p>
                   </div>
                   
                   <div className="bg-background p-6 rounded-lg border border-surfaceLight text-left max-w-md mx-auto">
                     <div className="flex justify-between items-center mb-4">
                       <span className="text-white/70">Final Fee</span>
                       <span className="text-xl font-bold text-white">₹{totalFees.toFixed(2)}</span>
                     </div>
                     
                     <div className="pt-6 border-t border-surfaceLight">
                       <p className="text-xs text-textMuted mb-3">Re-enter your RentHub password to finalize the transaction via {paymentMethod.toUpperCase()}.</p>
                       <input 
                          type="password" 
                          value={password} 
                          onChange={e => setPassword(e.target.value)} 
                          placeholder="Password" 
                          className="input-field w-full mb-2" 
                       />
                       {passwordError && <p className="text-xs text-red-500 mb-4">{passwordError}</p>}
                       <button onClick={() => {
                          if (!validatePassword(password)) { setPasswordError('Incorrect password'); return; }
                          alert("All Done! Thank you for using RentHub.");
                          clearCart();
                          if (user) localStorage.removeItem(`cart_step_${user.id}`);
                          navigate('/');
                       }} className="btn-primary w-full py-3 mt-4" disabled={!password}>Pay ₹{totalFees.toFixed(2)} Final Fee</button>
                     </div>
                   </div>
                </div>
              )}
              
            </div>

            {/* Right Column: Order Summary (Visible only in Step 0 and 1) */}
            {currentStep < 2 && (
              <div className="w-full lg:w-80 shrink-0">
                <div className="bg-background rounded-lg p-6 border border-surfaceLight sticky top-24">
                  <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6 border-b border-surfaceLight pb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3 relative">
                        <img src={item.thumbnail} alt={item.title} className="w-16 h-16 rounded object-cover border border-surfaceLight shrink-0" />
                        <div className="flex flex-col justify-between">
                          <h4 className="text-xs font-semibold text-white leading-tight pr-4">{item.title}</h4>
                          <div className="flex justify-between items-center w-full">
                             <p className="text-xs font-bold text-white">₹{(item.price_per_day_paise/100).toFixed(2)}/day</p>
                             {currentStep === 0 && (
                                <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase tracking-wider text-textMuted hover:text-red-500 transition-colors">
                                  Remove
                                </button>
                             )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 text-sm mb-6 pb-6 border-b border-surfaceLight">
                    <div className="flex justify-between text-textMuted">
                      <span>{cartItems.length} items rental</span>
                      <span className="text-white">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-textMuted">
                      <span>Delivery</span>
                      <span className="text-white">₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-textMuted">
                      <span>Taxes</span>
                      <span className="text-white">₹{T.toFixed(2)}</span>
                    </div>
                    {currentStep > 0 && (
                      <div className="flex justify-between text-amber mt-2 pt-2 border-t border-surfaceLight/50">
                        <span className="font-semibold">Sec. Deposit (Hold)</span>
                        <span className="font-bold">₹{totalSafetyDeposit.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Final Charge</span>
                    <span className="text-xl font-bold text-white">₹{totalFees.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-textMuted mt-2 leading-relaxed">Deposit is authorized separately and drops off after safe item return.</p>
                </div>
              </div>
            )}

          </div>
        )}
        
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-surfaceLight rounded-lg w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber/10 rounded-full flex items-center justify-center">
                <ShieldCheck size={32} className="text-amber" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Login Required</h3>
              <p className="text-sm text-textMuted leading-relaxed">
                You need to log in to your RentHub account before you can rent equipment. Your cart items will be saved.
              </p>
            </div>
            <div className="p-4 bg-background flex gap-3 border-t border-surfaceLight">
              <button
                onClick={() => { setShowLoginModal(false); navigate('/'); }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLoginModal(false); navigate('/login'); }}
                className="btn-primary flex-1"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
