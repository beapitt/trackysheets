import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { ChevronDown, X, MonitorPlay } from 'lucide-react'

// --- SOTTO-COMPONENTI GRAFICI (Design Claude AI) ---

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 5l2.5 2.5L8 3" stroke="#1F5C3E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DownloadArrow = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5v8M4.5 7.5l3 3 3-3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 12.5h12" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function TemplateDetail() {
  const { slug } = useParams()
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState<string | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('templates').select('*').eq('slug', slug).single()
      if (data) {
        setTemplate(data)
        setSelectedImg(data.thumbnail)
      }
      setLoading(false)
    }
    fetchData()
    window.scrollTo(0, 0)
  }, [slug])

  if (loading || !template) return null

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean)
  const faqData = Array.isArray(template.faqs) ? template.faqs : []

  const getYouTubeID = (url: string) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };
  const videoId = template.youtube_url ? getYouTubeID(template.youtube_url) : null;

  const specs = [
    { label: "Software", value: "Google Sheets" },
    { label: "License", value: "Personal Use" },
    { label: "Format", value: "Instant Copy" },
    { label: "Access", value: "No Login Required" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#4b5563] font-inter antialiased overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-5 md:px-10 pt-4 md:pt-6 pb-12">
        
        {/* TITOLO E DESCRIZIONE BREVE (No Italic, Grigio Antracite) */}
        <div className="mb-5 text-left">
          <h1 className="text-[26px] md:text-[34px] font-bold tracking-tight text-[#374151] leading-tight">
            {template.title}
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#6b7280] mt-2 font-medium max-w-4xl leading-relaxed">
            {template.short_description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 xl:col-span-9">
            {/* GALLERY */}
            <div className="mb-4">
              <div
                className="aspect-video bg-[#f9f9f7] rounded-[24px] overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in group relative"
                onClick={() => setLightboxImg(selectedImg)}
              >
                <img src={selectedImg || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" alt="View" />
              </div>

              <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-24 md:w-28 shrink-0 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImg === img ? 'border-[#1F5C3E] shadow-md' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Thumb" />
                  </button>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-8 max-w-4xl text-left px-1">
              <div className="text-[16px] text-[#4b5563] leading-relaxed whitespace-pre-wrap font-medium">
                {template.long_description}
              </div>
            </div>

            {/* HOW IT WORKS (CERCHIETTI) */}
            <div className="mb-8 bg-[#f9f9f6] p-7 rounded-[28px] border border-gray-100 max-w-4xl text-left">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-5">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { t: 'Click Download Now', d: 'Instant access to the file link.' },
                  { t: 'Select "Make a copy"', d: 'Directly to your Google Drive.' },
                  { t: 'Ready to use', d: 'Start tracking immediately.' }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1F5C3E] text-white flex items-center justify-center text-[12px] font-black shadow-md shadow-[#1F5C3E]/20">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#1f2937] mb-0.5">{step.t}</h4>
                      <p className="text-[12px] text-gray-500 leading-snug">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ CENTRALI */}
            {faqData.length > 0 && (
              <div className="mb-10 max-w-4xl text-left px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-1.5">
                  {faqData.map((item: any, i: number) => (
                    <div key={i} className="border border-gray-50 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-[14px] font-bold text-[#1f2937]">{item.q}</span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#1F5C3E]' : 'text-gray-300'}`} />
                      </button>
                      <div className={`transition-all duration-300 overflow-hidden ${openFaq === i ? 'max-h-[300px]' : 'max-h-0'}`}>
                        <div className="p-4 pt-0 bg-white text-[14px] leading-relaxed text-[#6b7280]">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 self-start space-y-6">
            
            {/* --- SPECS BOX CLAUDE AI --- */}
            <div className="flex flex-col w-full shadow-sm">
              <div className="bg-[#f5f4ed] rounded-t-[14px] px-5 pt-4 pb-3 border border-[#e8e6de] border-b-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">Technical Specs</p>
                <div className="flex flex-col">
                  {specs.map((row, i) => (
                    <div key={row.label} className={`flex justify-between items-center py-[8px] ${i < specs.length - 1 ? 'border-b border-black/[0.06]' : ''}`}>
                      <span className="text-[12px] text-gray-500">{row.label}</span>
                      <span className="text-[12px] text-[#1f2937] font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a
                href={template.google_sheets_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#1F5C3E] hover:bg-black text-white px-5 py-4 rounded-b-[14px] border border-[#1F5C3E] transition-all no-underline group"
              >
                <span className="flex items-center gap-3">
                  <DownloadArrow />
                  <span className="text-[14px] font-bold tracking-tight">Download for Sheets</span>
                </span>
                <ChevronRight />
              </a>
              <div className="flex justify-between pt-3 px-1">
                {["No macros", "Safe file", "Free forever"].map((label) => (
                  <span key={label} className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    <CheckIcon />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* VIDEO TUTORIAL */}
            {videoId && (
              <div className="bg-white rounded-[24px] p-1.5 border border-gray-100 shadow-sm overflow-hidden">
                <div className="aspect-video bg-black rounded-[20px] overflow-hidden relative">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title="Guide" />
                </div>
                <div className="p-3 flex items-center gap-2">
                  <MonitorPlay size={14} className="text-[#1F5C3E]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Video Tutorial</span>
                </div>
              </div>
            )}

            <Sidebar />
          </aside>
        </div>
      </main>

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X size={30} />
          </button>
          <img src={lightboxImg} className="max-w-full max-h-full rounded-xl object-contain shadow-2xl animate-in zoom-in duration-200" alt="Full" />
        </div>
      )}

      <Footer />
    </div>
  )
}
