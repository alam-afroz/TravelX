import { Home, HelpCircle, MessageSquare } from 'lucide-react';

interface CustomerCarePageProps {
  onBackToHome: () => void;
}

export function CustomerCarePage({ onBackToHome }: CustomerCarePageProps) {
  return (
    <div className="min-h-screen bg-[#e1ecf7] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white tracking-wide">Customer Care</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={onBackToHome}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-800 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">HOME</span>
          </button>
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 text-left bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">FAQs</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800">Raise a Query / Complaint</h2>
          </div>
          
          <p className="text-slate-600 mb-8">
            We are here to help! Please provide the details of your issue below, and our support team will get back to you as soon as possible.
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <input 
                type="text" 
                placeholder="Briefly describe your issue" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                rows={5} 
                placeholder="Provide more details about your query or complaint..." 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                onClick={(e) => e.preventDefault()} 
                className="w-full sm:w-auto px-6 py-3 bg-[#2d497c] hover:bg-[#1e293b] text-white font-medium rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
