export default function AboutUs() {
  return (
    <div className="flex-1 bg-background pt-16 pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Democratizing equipment access.</h1>
          <p className="text-textMuted text-lg max-w-2xl mx-auto">
            RentHub is a marketplace connecting owners of heavy machinery and household tools with those who need them. Trust-verified, fully insured, and seamless.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-surface rounded-xl p-8 border border-surfaceLight flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-4">Insured & Secure</h3>
            <p className="text-textMuted leading-relaxed mb-6">
              Every rental on RentHub is backed by a generated bailment contract with mandatory Aadhaar KYC and Face Matching for renters. Insurance premiums are automatically calculated into the final price.
            </p>
            <div className="flex items-center space-x-2 text-amber font-semibold text-sm">
              <span>Read the policy</span>
              <span>→</span>
            </div>
          </div>
          
          <div className="bg-[url('https://images.unsplash.com/photo-1541625602330-2277a4c4618c?w=900&auto=format&fit=crop&q=60')] bg-cover bg-center rounded-xl h-80 relative overflow-hidden border border-surfaceLight">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
              <p className="text-white font-bold text-lg">Heavy earthmoving equipment available next-day.</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-12">The RentHub Trust Flow</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-surfaceLight hidden sm:block -z-10"></div>
            
            {[
              { step: '01', title: 'Identity', desc: 'Secure DigiLocker Aadhaar verification' },
              { step: '02', title: 'Liveness', desc: 'Real-time face matching against government ID' },
              { step: '03', title: 'eSign', desc: 'Legally binding digital bailment contract' }
            ].map((s) => (
              <div key={s.step} className="card bg-background border-surfaceLight p-6 flex flex-col items-center text-center relative z-10 mx-auto w-full max-w-xs shadow-xl">
                 <div className="w-12 h-12 bg-amber rounded-full flex items-center justify-center text-background font-bold text-lg mb-4 ring-8 ring-background">
                   {s.step}
                 </div>
                 <h4 className="text-white font-semibold mb-2">{s.title}</h4>
                 <p className="text-textMuted text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
