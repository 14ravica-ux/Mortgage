import React, { useState } from 'react';
import { Phone, Mail, Home, Calculator as CalcIcon, FileText, Instagram, Facebook, MapPin, Share2, Globe } from 'lucide-react';
import { Calculator } from './components/Calculator';
import { ApplicationForm } from './components/ApplicationForm';

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'calculator'>('form');

  const handleShare = async () => {
    const shareData = {
      title: 'Ravi Patel Mortgage Services',
      text: 'Apply for a mortgage or calculate payments with Ravi Patel.',
      url: 'https://www.ravipatelmortgage.ca',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert(`Link copied: ${shareData.url}`);
      navigator.clipboard.writeText(shareData.url);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-brand-dark text-white sticky top-0 z-50 shadow-xl border-b border-brand-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
            
            {/* Branding */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <a href="https://www.ravipatelmortgage.ca" className="flex items-center gap-3 group">
                <div className="bg-gradient-to-br from-brand-accent to-amber-700 p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                  <Home className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none group-hover:text-brand-accent transition-colors">Ravi Patel</h1>
                  <p className="text-[10px] md:text-xs text-slate-400 tracking-[0.2em] uppercase mt-1 font-medium">Licensed Mortgage Associate</p>
                </div>
              </a>
              
              {/* Share Button (Mobile) */}
              <button onClick={handleShare} className="md:hidden p-2 text-slate-400 hover:text-white">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-4 text-sm md:text-base w-full md:w-auto justify-center md:justify-end">
              <a href="mailto:ravipatel@akal.ca" className="flex items-center gap-2 hover:text-brand-accent transition-colors text-slate-300">
                <Mail className="w-4 h-4" />
                <span className="hidden lg:inline">ravipatel@akal.ca</span>
              </a>
              <a href="tel:3065100059" className="flex items-center gap-2 bg-brand-primary hover:bg-blue-700 px-5 py-2 rounded-full transition-all shadow-lg hover:shadow-brand-primary/50 font-medium">
                <Phone className="w-4 h-4 fill-current" />
                <span>306-510-0059</span>
              </a>
              {/* Share Button (Desktop) */}
              <button onClick={handleShare} className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white ml-2 transition-colors" title="Share App Link">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow bg-slate-50 py-8 px-4 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto mb-8 relative z-10">
          <div className="flex p-1.5 bg-white rounded-2xl shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'form' 
                  ? 'bg-brand-primary text-white shadow-md scale-[1.02]' 
                  : 'text-slate-500 hover:text-brand-primary hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Mortgage Application
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'calculator' 
                  ? 'bg-brand-primary text-white shadow-md scale-[1.02]' 
                  : 'text-slate-500 hover:text-brand-primary hover:bg-slate-50'
              }`}
            >
              <CalcIcon className="w-4 h-4" />
              Payment Calculator
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
          {activeTab === 'form' ? <ApplicationForm /> : <Calculator />}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 font-sans relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          
          {/* Identity */}
          <div className="mb-10 text-center">
            <h2 className="text-white font-bold text-3xl tracking-tight mb-2">Ravi Patel</h2>
            <p className="text-base text-slate-400 font-medium">Licensed Mortgage Associate</p>
            <div className="inline-block mt-3 px-3 py-1 bg-slate-800 rounded text-xs text-brand-accent font-mono tracking-widest border border-slate-700">
              LICENSE NO. 514691
            </div>
            <div className="mt-4">
              <a href="https://www.ravipatelmortgage.ca" className="inline-flex items-center gap-1 text-brand-primary hover:text-brand-accent transition-colors text-sm font-semibold">
                <Globe size={14} /> www.ravipatelmortgage.ca
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 max-w-5xl mx-auto mb-10 border border-slate-700 shadow-2xl">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              
              {/* Left: Contact Details */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-slate-300 w-full lg:w-auto justify-center">
                 <div className="flex items-center gap-2 group">
                    <div className="p-2 bg-slate-700 rounded-full group-hover:bg-brand-primary transition-colors">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span>4822 Queen Street, Regina, S4S 6V8</span>
                 </div>
                 <span className="hidden sm:inline text-slate-600 h-4 w-px bg-slate-600"></span>
                 <div className="flex items-center gap-2 group">
                    <div className="p-2 bg-slate-700 rounded-full group-hover:bg-brand-primary transition-colors">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <a href="mailto:ravipatel@akal.ca" className="hover:text-white transition-colors">ravipatel@akal.ca</a>
                 </div>
                 <span className="hidden sm:inline text-slate-600 h-4 w-px bg-slate-600"></span>
                 <div className="flex items-center gap-2 group">
                    <div className="p-2 bg-slate-700 rounded-full group-hover:bg-brand-primary transition-colors">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <a href="tel:3065100059" className="hover:text-white transition-colors">306-510-0059</a>
                 </div>
              </div>

              {/* Right: Social Icons */}
              <div className="flex items-center gap-4">
                {/* WhatsApp */}
                <a 
                  href="https://wa.me/13065100059" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white p-2.5 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(37,211,102,0.5)] shadow-lg"
                  aria-label="Chat on WhatsApp"
                  title="Chat on WhatsApp"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                
                {/* Facebook */}
                <a 
                  href="https://www.facebook.com/search/top?q=Ravi%20Patel%20Mortgage" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-slate-700 hover:bg-[#1877F2] text-white p-2.5 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(24,119,242,0.5)] shadow-lg"
                  aria-label="Connect on Facebook"
                  title="Search Ravi Patel on Facebook"
                >
                  <Facebook size={20} />
                </a>

                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-slate-700 hover:bg-[#E1306C] text-white p-2.5 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(225,48,108,0.5)] shadow-lg"
                  aria-label="Connect on Instagram"
                  title="Connect on Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="text-center border-t border-slate-800 pt-8">
            <p className="text-xs text-slate-600">
                &copy; {new Date().getFullYear()} Ravi Patel. All rights reserved. <br/>
                <span className="opacity-50">Calculations are for estimation purposes only. Contact for an official quote.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}