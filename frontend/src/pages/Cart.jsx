import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Calendar, Clock, ArrowRight, ArrowLeft, Trash2, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const steps = [
  'Items', 'Rental Dates', 'Attachments', 'Delivery', 'Contact', 'Billing'
];

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, subtotal } = useCart();
  const [currentStep, setCurrentStep] = useState(1); // 0-indexed, starts at 1 for "Rental Dates" based on reference UI
  
  const T = 245.31;
  const taxes = cartItems.length ? T : 0;
  const delivery = cartItems.length ? 321.12 : 0;
  const total = subtotal + taxes + delivery;

  const [dateRange, setDateRange] = useState({ 
    start: 'Aug 2, 2026', 
    end: 'Aug 3, 2026',
    startTime: 'Afternoon (2-5 PM)',
    endTime: 'Midday (10-2 PM)'
  });
  
  const handleCheckout = () => {
     if (currentStep < 5) {
        setCurrentStep(v => v + 1);
     } else {
        alert("Proceeding to Mock Checkout / DigiLocker KYC flow");
        clearCart();
     }
  };

  return (
    <div className="flex-1 bg-surface pt-8 pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Step Indicator */}
        <div className="flex flex-wrap items-center justify-between md:justify-start md:space-x-8 mb-12 overflow-x-auto pb-4 border-b border-surfaceLight">
          {steps.map((label, idx) => (
            <div key={idx} className={cn(
              "flex items-center space-x-2 shrink-0 mb-2 md:mb-0",
              currentStep === idx ? "text-amber font-semibold" : 
              currentStep > idx ? "text-white/70" : "text-white/30"
            )}>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                currentStep === idx ? "bg-amber text-black" : 
                currentStep > idx ? "bg-white/20 text-white" : "bg-white/10 text-white/50"
              )}>
                {currentStep > idx ? <CheckCircle size={14} /> : (idx + 1)}
              </div>
              <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        {cartItems.length === 0 && currentStep === 1 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-textMuted mb-8">Add some equipment from the catalog to get started.</p>
            <Link to="/catalog" className="btn-primary">Browse Catalog</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Wizard Steps */}
            <div className="flex-1">
              
              {currentStep === 1 && (
                <div className="animate-fade-in-up">
                  <h2 className="text-2xl font-bold text-white mb-6">Select Rental Dates</h2>
                  
                  <div className="flex flex-col md:flex-row gap-8 bg-background p-6 rounded-lg border border-surfaceLight">
                    
                    {/* Mock Calendar */}
                    <div className="flex-1 border-r-0 md:border-r border-surfaceLight md:pr-8">
                       <div className="flex justify-between items-center mb-4">
                         <button className="text-textMuted hover:text-white"><ArrowLeft size={16}/></button>
                         <span className="font-semibold text-white">August 2026</span>
                         <span className="font-semibold text-white">September 2026</span>
                         <button className="text-textMuted hover:text-white"><ArrowRight size={16}/></button>
                       </div>
                       
                       <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center text-[10px] mb-2 text-textMuted uppercase font-semibold">
                         <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                       </div>
                       
                       <div className="grid grid-cols-7 gap-1 text-center text-sm text-white">
                          {[28,29,30,31,1].map(d => <div key={'prev'+d} className="p-2 text-white/20">{d}</div>)}
                          <div className="p-2 bg-amber text-black font-bold rounded-l-md">2</div>
                          <div className="p-2 bg-amber/50 text-white font-bold rounded-r-md border border-amber">3</div>
                          {[4,5,6,7,8,9,10,11,12].map(d => <div key={d} className="p-2 hover:bg-white/10 rounded cursor-pointer transition-colors">{d}</div>)}
                       </div>
                       <p className="mt-8 text-xl font-bold text-white tracking-tight">2 Days</p>
                    </div>

                    {/* Time selection */}
                    <div className="flex-1 space-y-6">
                       <div>
                         <label className="text-[10px] text-textMuted uppercase font-bold mb-2 block">Rental Start</label>
                         <div className="flex gap-2">
                           <input type="text" value={dateRange.start} readOnly className="input-field w-full text-white font-medium bg-surface" />
                         </div>
                       </div>
                       <div>
                         <label className="text-[10px] text-textMuted uppercase font-bold mb-2 block">Rental End</label>
                         <div className="flex gap-2">
                           <input type="text" value={dateRange.end} readOnly className="input-field w-full text-white font-medium bg-surface" />
                         </div>
                       </div>
                       
                       <div className="grid gap-4 mt-4">
                         <div>
                           <label className="text-[10px] text-textMuted uppercase font-bold mb-2 block">Time Start</label>
                           <select className="input-field w-full text-sm">
                             <option>{dateRange.startTime}</option>
                           </select>
                         </div>
                         <div>
                           <label className="text-[10px] text-textMuted uppercase font-bold mb-2 block">Time End</label>
                           <select className="input-field w-full text-sm">
                             <option>{dateRange.endTime}</option>
                           </select>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep > 1 && (
                <div className="animate-fade-in-up text-center py-20 bg-background rounded-lg border border-surfaceLight">
                  <h2 className="text-2xl font-bold text-white mb-4">Step {currentStep + 1}: {steps[currentStep]}</h2>
                  <p className="text-textMuted mb-8">This section is mocked for the demo. Proceed to checkout.</p>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex justify-between items-center mt-8">
                {currentStep > 0 && (
                  <button 
                    onClick={() => setCurrentStep(v => v-1)}
                    className="btn-outline px-8"
                  >
                    BACK
                  </button>
                )}
                <button 
                  onClick={handleCheckout}
                  className="btn-primary px-12 ml-auto"
                >
                  {currentStep === 5 ? 'CHECKOUT' : 'NEXT'}
                </button>
              </div>

            </div>

            {/* Right Column: Cart Sidebar */}
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
                           <p className="text-sm font-bold text-white">${item.price}</p>
                           <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase tracking-wider text-textMuted hover:text-red-500 transition-colors">
                             Remove
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 text-sm mb-6 pb-6 border-b border-surfaceLight">
                  <div className="flex justify-between text-textMuted">
                    <span>{cartItems.length} items worth</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-textMuted">
                    <span>Return</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-textMuted">
                    <span>Delivery</span>
                    <span className="text-white">${delivery.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-surfaceLight/50 text-textMuted">
                    <span>Subtotal</span>
                    <span className="text-white">${(subtotal + delivery).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-textMuted">
                    <span>Taxes</span>
                    <span className="text-white">${taxes.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        )}
        
      </div>
    </div>
  );
}
