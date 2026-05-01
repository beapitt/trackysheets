import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { 
  LayoutGrid, Zap, BarChart3, X, ChevronDown, ChevronLeft, Download, ShieldCheck, FileSpreadsheet
} from 'lucide-react'

export default function TemplateDetail() {
  const { slug } = useParams()
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState<string | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      const { data: tData } = await supabase.from('templates').select('*').eq('slug', slug).single()
      if (tData) {
        setTemplate(tData)
        setSelectedImg(tData.thumbnail)
      }
      setLoading(false)
    }
    fetchData()
    window.scrollTo(0, 0);
  }, [slug])

  if (loading) return <div className="p-20 text-center font-bold text-gray-300 uppercase tracking-widest text-[10px]">Loading...</div>
  if (!template) return <div className="p-20 text-center font-sans text-gray-500">Template not found</div>

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean)
  
  const parseList = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      return data.split('\n').map(item => item.trim()).filter(item => item !== '');
    }
    return [];
  };

  const featuresList = parseList(template.features);
  
  const howToUseSteps = [
    "Click the download button to access the official Google Sheets template link and create your personal copy.",
    "Open the file in your Google account and follow the setup instructions to customize categories and initial settings.",
    "Start tracking your data daily to get real-time visual insights and automated financial reports instantly."
  ];

  const featureIcons = [
    <LayoutGrid size={22} strokeWidth={2.5} className="text-[#1F5C3E]" />, 
    <Zap size={22} strokeWidth={2.5} className="text-[#1F5C3E]" />, 
    <BarChart3 size={22} strokeWidth={2.5} className="text-[#1F5C3E]" />
  ];

  const faqData = Array.isArray(template.faqs) ? template.faqs : [];

  return (
    <>
      <Navbar />

      {/* Container compatto a 1320px per eliminare i vuoti eccessivi */}
      <main className="flex-grow w-full max-w-[1320px] mx-auto px-6 lg:px-10 py-10">
        
        {/* Navigazione */}
        <Link to="/" className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest no-underline hover:text-[#1F5C3E] mb-8 transition-colors">
          <ChevronLeft size={14} /> Back to all templates
        </Link>

        <div className="flex flex-col lg:flex-row items-start gap-12">
          
          {/* CONTENUTO PRINCIPALE (SINISTRA) */}
          <div className="flex-1 min-w-0 w-full text-left">
            
            {/* Titolo e Badge */}
            <div className="mb-8">
              <h1 className="text-[28px] md:text-[36px] font-bold text-gray-900 leading-tight mb-4">
                {template.title}
              </h1>
              <div className="flex flex-wrap gap-3">
                <span className="bg-[#EAF3DE] text-[#1F5C3E] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Free Google Sheets
                </span>
                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Instant Access
                </span>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="mb-10">
              <div 
                className="aspect-video bg-[#f5f4ed] rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm cursor-zoom-in"
                onClick={() => setLightboxImg(selectedImg)}
              >
                <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(img)} 
                    className={`flex-shrink-0 w-24 md:w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-60'}`}>
                    <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            </div>

            {/* Descrizione Lunga */}
            <div className="mb-12">
              <h2 className="text-[18px] font-bold text-gray-900 mb-4 border-l-4 border-[#C0DD97] pl-4">Description</h2>
              <div className="text-[15px] leading-relaxed text-gray-600 space-y-4">
                {template.long_description?.split('\n').map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {/* Features Included */}
            <div className="mb-12">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">What's included</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuresList.map((f: string, i: number) => (
                  <div key={i} className="bg-[#f5f4ed] p-5 rounded-xl border border-gray-100 flex flex-col gap-3">
                    <div>{featureIcons[i] || featureIcons[0]}</div>
                    <div className="text-[14px] font-bold text-gray-800 leading-tight">
                      {f.includes(':') ? f.split(':')[0] : f}
                    </div>
                    {f.includes(':') && <p className="text-[11px] text-gray-500 leading-tight">{f.split(':')[1]}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* How to Use */}
            <div className="mb-12 border-t border-gray-100 pt-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">How to use</h3>
              <div className="space-y-6">
                {howToUseSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1F5C3E] text-white text-[10px] font-black shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-[14px] text-gray-600 font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            {faqData.length > 0 && (
              <div className="mb-12 border-t border-gray-100 pt-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">FAQ</h3>
                <div className="divide-y divide-gray-100 border-b border-gray-100">
                  {faqData.map((item: any, i: number) => (
                    <div key={i} className="py-2">
                      <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex justify-between items-center py-4 text-left group"
                      >
                        <span className="text-[14px] font-bold text-gray-800 group-hover:text-[#1F5C3E] transition-colors pr-8">
                          {item.q}
                        </span>
                        <ChevronDown size={18} className={`text-gray-300 transition-transform ${openFaq === i ? 'rotate-180 text-[#1F5C3E]' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-[400px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-[14px] text-gray-500 leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR (DESTRA) - Sticky Dinamica */}
          <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-24 self-start">
            
            {/* Download Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
              <div className="flex items-center gap-2 text-[#1F5C3E] mb-3">
                <ShieldCheck size={18} />
                <span className="text-[12px] font-bold uppercase tracking-wider">Free & Secure</span>
              </div>
              <h3 className="text-[16px] font-bold text-gray-900 mb-4 text-left">Get Template</h3>
              
              <a 
                href={template.google_sheets_url || template.download_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#1F5C3E] text-white py-4 rounded-xl font-bold text-[14px] no-underline shadow-md hover:bg-black transition-all mb-4"
              >
                <Download size={18} /> Make a Copy
              </a>
              
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                  <Zap size={14} className="text-[#C0DD97]" /> No registration needed
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                  <FileSpreadsheet size={14} className="text-[#C0DD97]" /> Google Sheets Format
                </div>
              </div>
            </div>

            {/* Video, Categories, Social dalla Sidebar generica */}
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/95 z-[110] flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white">
            <X size={32} />
          </button>
          <img src={lightboxImg} className="max-w-full max-h-full rounded-lg" alt="Enlarged" />
        </div>
      )}
    </>
  )
}
