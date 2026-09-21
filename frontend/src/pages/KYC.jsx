import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Camera, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function KYC() {
  const [step, setStep] = useState(1); // 1 = Form, 2 = Camera, 3 = Success
  
  // KYC Form State
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  // Camera State
  const [photoTaken, setPhotoTaken] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const navigate = useNavigate();
  const { user, loginUser } = useAuth(); // To update kyc_verified status

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Please allow camera access to complete face match.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Turn on camera when entering step 2
  useEffect(() => {
    if (step === 2 && !photoTaken) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [step, photoTaken]);


  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!aadhaar || !otp || !pin || !consent) {
       setError("Please fill all fields and accept the consent checkbox.");
       return;
    }
    if (otp !== '123456' || pin !== '123456') {
       setError("Invalid OTP or PIN. Please use 123456 for both.");
       return;
    }
    setError('');
    setStep(2);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 400, 300);
      setCapturedImage(canvasRef.current.toDataURL('image/png'));
      setPhotoTaken(true);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setPhotoTaken(false);
    startCamera();
  };

  const handleFinish = () => {
    if (user) {
      loginUser({ ...user, kyc_verified: true });
    }
    setStep(3);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (step === 3) {
    return (
      <div className="flex-1 bg-background flex flex-col justify-center items-center p-4">
         <div className="text-center animate-fade-in-up">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Verification Complete!</h2>
            <p className="text-textMuted">Redirecting you to the catalog...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-lg mb-8 text-center">
         <ShieldCheck size={40} className="text-amber mx-auto mb-4" />
         <h1 className="text-3xl font-bold text-white mb-2">Trust & Safety KYC</h1>
         <p className="text-textMuted text-sm">RentHub relies on verified identities to maintain a safe marketplace.</p>
      </div>

      <div className="card w-full max-w-lg p-6 md:p-8 border-surfaceLight">
        {step === 1 && (
          <form onSubmit={handleFormSubmit} className="space-y-6 animate-fade-in-up">
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded">{error}</div>}
            
            <div>
              <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">Aadhaar Number</label>
              <input 
                type="text" 
                value={aadhaar}
                onChange={e => setAadhaar(e.target.value.replace(/\D/g, ''))} // Strictly numeric replace
                maxLength={12}
                className="input-field w-full" 
                placeholder="0000 0000 0000"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">OTP verification</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  className="input-field w-full text-center tracking-widest" 
                  placeholder="123456"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-textMuted mb-2 block">DigiLocker PIN</label>
                <input 
                  type="password" 
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  maxLength={6}
                  className="input-field w-full text-center tracking-[0.5em]" 
                  placeholder="******"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-6 p-4 rounded bg-surface/50 border border-surfaceLight">
              <input 
                type="checkbox" 
                id="consent"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-surfaceLight bg-background text-amber focus:ring-amber focus:ring-opacity-20 cursor-pointer" 
              />
              <label htmlFor="consent" className="text-xs text-textMuted cursor-pointer leading-tight">
                I hereby state that I have no objection in authenticating myself with Aadhaar based authentication system and consent to providing my Aadhaar & DigiLocker details to RentHub for validation.
              </label>
            </div>

            <button type="submit" className="btn-primary w-full py-4 mt-8 uppercase tracking-wider text-sm">Verify Aadhaar</button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up text-center">
            <h3 className="text-xl font-bold text-white mb-2">Liveliness & Face Match</h3>
            <p className="text-xs text-textMuted mb-6 px-4">Take a straight-facing photo in good lighting to match against your Aadhaar profile.</p>
            
            <div className={cn(
              "w-full h-64 mx-auto rounded-lg overflow-hidden border-2 flex flex-col items-center justify-center relative transition-all duration-300",
              photoTaken ? "border-amber bg-surface" : "border-dashed border-surfaceLight bg-surface"
            )}>
              {!photoTaken ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
              ) : (
                <img src={capturedImage} alt="Captured face" className="w-full h-full object-cover" />
              )}
              
              <canvas ref={canvasRef} width="400" height="300" className="hidden"></canvas>
              
              {/* Fake crosshairs */}
              <div className="absolute inset-0 pointer-events-none z-10">
                 <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber/50"></div>
                 <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber/50"></div>
                 <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber/50"></div>
                 <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber/50"></div>
              </div>
            </div>

            {error && <div className="text-red-500 text-xs mt-2">{error}</div>}

            {!photoTaken ? (
              <button onClick={takePhoto} disabled={!stream} className="btn-primary w-full py-4 flex items-center justify-center gap-2 mt-6">
                <div className="w-4 h-4 bg-black rounded-full shadow-[0_0_0_2px_#F5A623]"></div> Capture
              </button>
            ) : (
              <div className="flex gap-4 mt-6">
                <button onClick={handleRetake} className="btn-outline flex-1 py-3 text-sm">Retake</button>
                <button onClick={handleFinish} className="btn-primary flex-1 py-3 text-sm">OK, Looks Good</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
