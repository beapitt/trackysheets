import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { ChevronDown, Download, X, CheckCircle2, MonitorPlay, ArrowRight } from 'lucide-react'

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

  return (
    <div className="min-h-screen bg-white text-[#4b5563] font-inter antialiased overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-5 md:px-10 pt-4 md:pt-6 pb-12">
        
        {/* TITOLO - Grigio Antracite & Dimensione ridotta */}
        <div className="mb-4 text-left">
          <h1 className="text-[24px] md:text-[30px] font-bold tracking-tight text-[#374151] leading-tight">
            {template.title}
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#6b7280] mt-1 font-medium max-w-4xl leading-relaxed">
            {template.short_description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          <div className="lg:col-span-8 xl:col-span-9">
            {/* GALLERY */}
            <div className="mb-4">
              <div
                className="aspect-video bg-[#f9f9f7] rounded-[24px] overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in group relative"
                onClick={() => setLightboxImg(selectedImg)}
              >
                <img src={selectedImg || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" alt="Preview" />
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
            <div className="mb-6 max-w-4xl text-left px-1">
              <div className="text-[15px] text-[#4b5563] leading-relaxed whitespace-pre-wrap font-medium">
                {template.long_description}
              </div>
            </div>

            {/* HOW IT WORKS */}
            <div className="mb-8 bg-[#f9f9f6] p-6 rounded-[24px] border border-gray-100 max-w-4xl text-left">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F5C3E] mb-4">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { t: 'Click Download Now', d: 'Instant access to the file link.' },
                  { t: 'Select "Make a copy"', d: 'Saves directly to your Drive.' },
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
              <div className="mb-8 max-w-4xl text-left px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Frequently Asked Questions</h3>
                <div className="space-y-1.5">
                  {faqData.map((item: any, i: number) => (
                    <div key={i} className="border border-gray-50 rounded-xl overflow-hidden transition-all">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex justify-between items-center p-3 text-left bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-[13px] font-bold text-[#1f2937]">{item.q}</span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#1F5C3E]' : 'text-gray-300'}`} />
                      </button>
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === i ? 'max-h-[300px]' : 'max-h-0'}`}>
                        <div className="p-3 pt-0 bg-white">
                          <p className="text-[13px] text-[#6b7280] leading-relaxed font-medium">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR - BOX SPECS STILE CLAUDE AI */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 self-start space-y-4">
            
            <div className="bg-[#fdfdf9] rounded-[24px] p-5 border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-4">Specs</h4>
              
              <div className="space-y-3 mb-6">
                {[
                  {l:'Software', v:'Google Sheets'}, 
                  {l:'Version', v:'1.0 (Latest)'}, 
                  {l:'License', v:'Free'}
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-100/50 pb-2.5">
                    <span className="text-[12px] text-gray-400 font-bold">{item.l}</span>
                    <span className="text-[12px] text-[#1f2937] font-black">{item.v}</span>
                  </div>
                ))}
              </div>

              <a
                href={template.google_sheets_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#1F5C3E] text-white py-4 rounded-xl font-bold text-[14px] hover:bg-black transition-all shadow-lg shadow-[#1F5C3E]/10 no-underline mb-6"
              >
                <Download size={18} strokeWidth={2.5} />
                <span>Download for Sheets</span>
              </a>

              <div className="flex flex-col gap-2.5">
                {['No Macros / Safe File', '100% Free Forever'].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <CheckCircle2 size={14} className="text-[#1F5C3E]" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* VIDEO TUTORIAL */}
            {videoId && (
              <div className="bg-white rounded-[24px] p-1.5 border border-gray-100 shadow-sm">
                <div className="aspect-video bg-black rounded-[20px] overflow-hidden relative">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title="Video guide" />
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
          <img src={lightboxImg} className="max-w-full max-h-full rounded-xl object-contain shadow-2xl animate-in zoom-in duration-200" alt="Full View" />
        </div>
      )}

      <Footer />
    </div>
  )
}
