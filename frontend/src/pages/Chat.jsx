import { useState } from 'react';
import { Send, Phone, MoreVertical, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi, is the Bosch hammer drill still available for this weekend?", senderId: 'user123', timestamp: '10:00 AM' },
    { id: 2, text: "Yes it is! I'm located downtown. Are you able to pick it up?", senderId: 'owner456', timestamp: '10:05 AM' },
    { id: 3, text: "Perfect. Does it come with concrete bits?", senderId: 'user123', timestamp: '10:12 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  
  // Pretend current user is user123 (Renter)
  const isMe = (id) => id === 'user123';

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      text: inputText, 
      senderId: 'user123', 
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }]);
    setInputText('');
  };

  return (
    <div className="flex-1 bg-background flex flex-col pt-2 h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto w-full flex-1 flex my-6 rounded-lg border border-surfaceLight overflow-hidden bg-surface">
        
        {/* Sidebar */}
        <aside className="w-80 border-r border-surfaceLight hidden md:flex flex-col">
          <div className="p-4 border-b border-surfaceLight bg-surfaceLight/30">
            <h2 className="font-bold text-white uppercase text-sm">Inbox</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Mock Conversation item */}
            <div className="p-4 border-b border-surfaceLight cursor-pointer bg-amber/5 border-l-2 border-l-amber">
               <div className="flex justify-between items-start mb-1">
                 <h3 className="font-semibold text-white text-sm">John D.</h3>
                 <span className="text-[10px] text-textMuted text-amber">10:12 AM</span>
               </div>
               <p className="text-xs text-textMuted line-clamp-1">Perfect. Does it come with concrete bits?</p>
               <span className="mt-2 text-[10px] uppercase font-bold text-background bg-amber px-2 py-0.5 rounded inline-block">Request Pending</span>
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-16 border-b border-surfaceLight flex items-center justify-between px-6 bg-surfaceLight/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-background border border-amber flex items-center justify-center text-amber font-bold">J</div>
              <div>
                <h3 className="text-white font-bold text-sm">John D.</h3>
                <p className="text-[10px] text-textMuted flex items-center"><ShieldAlert size={10} className="mr-1 text-green-500" /> ID Verified</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-textMuted">
               <button className="hover:text-white transition-colors"><Phone size={18} /></button>
               <button className="hover:text-white transition-colors"><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* Item Context Banner */}
          <div className="p-3 bg-background/50 border-b border-surfaceLight flex justify-between items-center px-6 border-dashed">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-surface rounded overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=100&auto=format&fit=crop&q=60" className="opacity-80" />
               </div>
               <div>
                  <p className="text-xs text-white font-bold">Bosch Pro Hammer Drill</p>
                  <p className="text-[10px] text-amber">$45 / day</p>
               </div>
            </div>
            <button className="btn-primary py-1.5 px-4 text-[10px] uppercase">Review Request</button>
          </div>

          {/* Messages Window */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col bg-background/20" style={{ backgroundImage: 'radial-gradient(#2A2A2A 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            {messages.map(msg => (
               <div key={msg.id} className={cn("flex flex-col max-w-[70%]", isMe(msg.senderId) ? "self-end items-end" : "self-start items-start")}>
                 <div className={cn(
                   "px-4 py-3 rounded-lg text-sm",
                   isMe(msg.senderId) ? "bg-amber text-background rounded-br-sm" : "bg-surfaceLight text-white rounded-bl-sm"
                 )}>
                   {msg.text}
                 </div>
                 <span className="text-[10px] text-textMuted mt-1">{msg.timestamp}</span>
               </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-surfaceLight bg-surface">
            <form onSubmit={handleSend} className="relative">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..." 
                className="input-field w-full pr-12 focus:border-amber focus:ring-1 focus:ring-amber"
              />
              <button 
                type="submit" 
                className={cn("absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded transition-colors", inputText.trim() ? "text-amber" : "text-textMuted")}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </main>

      </div>
    </div>
  );
}
