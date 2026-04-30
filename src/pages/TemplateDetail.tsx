import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { 
  LayoutGrid, Zap, BarChart3, Check, 
  Search, X, MonitorPlay 
} from 'lucide-react'

export default function TemplateDetail() {
  const { slug } = useParams()
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState<string | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data: tData } = await supabase.from('templates').select('*').eq('slug', slug).single()
      if (tData) {
        setTemplate(tData)
        setSelectedImg(tData.thumbnail)
      }
      const { data: cData } = await supabase.from('categories').select('*').order('name')
      if (cData) setCategories(cData)
      setLoading(false)
    }
    fetchData()
  }, [slug])

  if (loading) return <div className="p-20 text-center font-bold text-gray-300 uppercase tracking-widest text-[10px]">Loading...</div>
  if (!template) return <div className="p-20 text-center font-sans text-gray-500">Template not found</div>

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean)
  
  const parseList = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      if (data.startsWith('[') && data.endsWith(']')) {
        try { return JSON.parse(data); } catch (e) { }
      }
      return data.split('\n').map(item => item.trim()).filter(item => item !== '');
    }
    return [];
  };

  const getYouTubeID = (url: string) => {
    if (!url) return null;
    if (url.length === 11 && !url.includes('/') && !url.includes('.')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeID(template.youtube_url);
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

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans text-left overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-12 py-6 md:py-10 text-left">
        {/* CORREZIONE: Aggiunto items-start per far funzionare lo sticky della Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
          
          <main className="w-full lg:flex-[0.74] min-w-0">
            {/* TITOLO */}
            <div className="mb-6 md:mb-10 text-left">
                <h1 className="leading-snug mb-2 text-[22px] md:text-[26px] text-[#1f2937] font-medium tracking-tight">
                  {template.title}
                </h1>
                <p className="text-[13px] text-[#4b5563] leading-relaxed max-w-3xl">
                  {template.short_description?.replace(/<\/?[^>]+(>|$)/g, "")}
                </p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10 mb-8">
              {/* GALLERY */}
              <div className="lg:col-span-8 overflow-hidden">
                <div 
                  className="aspect-video bg-[#f5f4ed] rounded-xl overflow-hidden mb-4 border border-gray-100 shadow-sm cursor-zoom-in"
                  onClick={() => setLightboxImg(selectedImg)}
                >
                  <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImg(img)} 
                      className={`flex-shrink-0 w-24 md:w-28 aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-50'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              </div>

              {/* SPECIFICHE TECNICHE */}
              <div className="lg:col-span-4 flex flex-col w-full">
                <div className="bg-[#f5f4ed] rounded-xl p-5 border border-gray-100 mb-4 shadow-sm overflow-hidden">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-left">Technical Specifications</h4>
                  <div className="space-y-3 text-[12px] font-medium text-gray-700">
                    {[
                      { label: 'Software', value: template.software || 'Google Sheets' },
                      { label: 'License', value: 'Personal Use' },
                      { label: 'Format', value: template.file_format || 'Instant Copy' },
                      { label: 'Access', value: 'No Login' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-200/40 pb-2 last:border-0 min-w-0">
                        <span className="text-gray-400 font-bold flex-shrink-0 mr-4">{item.label}</span>
                        <span className="text-gray-700 truncate text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a href={template.download_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#1F5C3E] text-white py-3.5 rounded-xl font-bold uppercase text-[12px] tracking-[0.1em] shadow-lg hover:bg-black transition-all no-underline">
                  ↓ Download Now
                </a>
              </div>
            </div>

            <div className="max-w-full text-left">
              <div className="border-l-4 border-[#C0DD97] pl-4 md:pl-6 mb-8">
                <div className="text-[15px] md:text-[17px] text-gray-600 leading-snug font-normal prose prose-flat max-w-none text-left">
                    {template.long_description?.split('\n').map((line: string, i: number) => (
                       <p key={i} className="mb-3">{line}</p>
                    ))}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#374151] mb-5 text-left">What's included</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {featuresList.map((f: string, i: number) => (
                    <div key={i} className="bg-[#f5f4ed] px-5 py-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center min-h-[130px] text-left">
                      <div className="mb-3">{featureIcons[i] || featureIcons[0]}</div>
                      <h4 className="text-[16px] md:text-[18px] font-semibold mb-1 text-[#454544] tracking-tight leading-tight">
                        {f.includes(':') ? f.split(':')[0] : f}
                      </h4>
                      {f.includes(':') && <p className="text-[11px] text-gray-500 leading-tight font-medium mt-1">{f.split(':')[1]}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* HOW TO USE - Ridotto il margine inferiore per evitare il buco bianco */}
              <div className="mb-4 border-t border-gray-100 pt-8 text-left">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#374151] mb-6">How to use</h3>
                <div className="space-y-5">
                  {howToUseSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 md:gap-6 max-w-4xl text-left">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1F5C3E] text-white text-[11px] font-black shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-[15px] md:text-[16px] text-gray-600 leading-snug font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* SIDEBAR DINAMICA */}
          <Sidebar />

        </div>
      </div>

      <Footer />

      {lightboxImg && (
        <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white">
            <X size={32} />
          </button>
          <img src={lightboxImg} className="max-w-full max-h-full rounded-lg" alt="Enlarged" />
        </div>
      )}
    </div>
  )
}
