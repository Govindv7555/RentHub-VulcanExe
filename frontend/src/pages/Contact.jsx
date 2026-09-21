export default function Contact() {
  return (
    <div className="flex-1 w-full bg-background pt-12 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Contacts</h1>
        <p className="text-textMuted mb-12">Get in touch with our team for enterprise rentals or support.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Info Side */}
          <div className="card border-0 bg-transparent p-0 md:pr-12">
            <h3 className="text-xs uppercase tracking-widest text-amber font-semibold border-b border-amber/20 pb-4 mb-8">
              Contact information
            </h3>
            
            <div className="space-y-8">
              <div>
                <p className="text-xs text-textMuted uppercase mb-1">Phone Number</p>
                <p className="text-white font-medium">+91 98765 43210</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase mb-1">Email Address</p>
                <p className="text-white font-medium">contact@renthub.demo</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase mb-1">Address</p>
                <p className="text-white font-medium max-w-[200px] leading-relaxed">
                  Sector 62, Noida<br/>
                  New Delhi, DL 110001
                </p>
              </div>
            </div>
          </div>
          
          {/* Form Side (Amber card) */}
          <div className="bg-amber p-8 md:p-10 rounded-lg shadow-2xl relative overflow-hidden">
             
            <form className="relative z-10 flex flex-col space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-black/60 uppercase font-bold mb-1 block">Full name</label>
                  <input type="text" className="w-full bg-white/20 border border-black/10 rounded px-3 py-2 text-black placeholder-black/30 focus:outline-none focus:bg-white/30 transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-[10px] text-black/60 uppercase font-bold mb-1 block">Company name</label>
                  <input type="text" className="w-full bg-white/20 border border-black/10 rounded px-3 py-2 text-black placeholder-black/30 focus:outline-none focus:bg-white/30 transition-colors" placeholder="BuildCo Inc" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-black/60 uppercase font-bold mb-1 block">Email</label>
                  <input type="email" className="w-full bg-white/20 border border-black/10 rounded px-3 py-2 text-black placeholder-black/30 focus:outline-none focus:bg-white/30 transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-[10px] text-black/60 uppercase font-bold mb-1 block">Phone number</label>
                  <input type="tel" className="w-full bg-white/20 border border-black/10 rounded px-3 py-2 text-black placeholder-black/30 focus:outline-none focus:bg-white/30 transition-colors" placeholder="+91 98765 43210" />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] text-black/60 uppercase font-bold mb-1 block">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-white/20 border border-black/10 rounded px-3 py-2 text-black placeholder-black/30 focus:outline-none focus:bg-white/30 transition-colors resize-none" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button className="bg-black text-amber hover:bg-black/90 font-bold uppercase tracking-wider py-3 px-8 rounded self-start transition-colors mt-2 text-xs">
                Send Message
              </button>
            </form>
            
            <div className="mt-8 flex gap-4 text-xs font-semibold text-black/60">
              <a href="#" className="hover:text-black transition-colors">Terms</a>
              <span className="opacity-30">•</span>
              <a href="#" className="hover:text-black transition-colors">Privacy</a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
