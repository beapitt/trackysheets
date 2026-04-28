import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import { 
  LayoutGrid, Zap, BarChart3, Check, 
  Search, ArrowRight, X, MonitorPlay 
} from 'lucide-react'

const PinterestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#E60023">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.947-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.22 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24 18.637 24 24 18.632 24 12.012 24 5.39 18.637 0 12.017 0z"/>
  </svg>
);

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

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans">
      <Navbar />

      <div className="w-full max-w-[1550px] mx-auto px-12 py-8">
        
        <nav className="text-[11px] font-bold text-gray-400 mb-6 uppercase tracking-[0.1em]">
          <Link to="/" className="hover:text-[#1F5C3E] no-underline">Home</Link>
          <span className="mx-3 text-gray-200">/</span>
          <span className="text-gray-600">Templates</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-14 items-start">
          
          <main className="flex-[0.74] w-full">
            {/* TITOLO + SHORT DESCRIPTION (DIMENSIONI RIDOTTE #454544) */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-[30px] font-black tracking-tighter mb-2 leading-tight text-[#454544]">
                  {template.title}
                </h1>
                <p className="text-[16px] text-[#454544] font-bold tracking-tight max-w-4xl leading-relaxed">
                    {template.short_description?.replace(/<\/?[^>]+(>|$)/g, "")}
                </p>
            </div>

            <div className="grid xl:grid-cols-12 gap-10 mb-8">
              <div className="xl:col-span-8">
                <div 
                  className="aspect-[21/9] bg-[#f5f4ed] rounded-xl overflow-hidden mb-5 border border-gray-100 shadow-sm cursor-zoom-in"
                  onClick={() => setLightboxImg(selectedImg)}
                >
                  <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <div className="flex gap-3">
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImg(img)} 
                      className={`w-28 aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedImg === img ? 'border-[#1F5C3E]' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              </div>

              {/* SIDE BOX */}
              <div className="xl:col-span-4 flex flex-col">
                <div className="bg-[#f5f4ed] rounded-xl p-5 border border-gray-100 mb-4 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Technical Specifications</h4>
                  <div className="space-y-3 text-[12px] font-medium">
                    {[
                      { label: 'Software', value: template.software || 'Google Sheets' },
                      { label: 'License', value: 'Personal Use Only' },
                      { label: 'Format', value: template.file_format || 'Instant Copy' },
                      { label: 'Access', value: 'No Login Required' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-200/40 pb-2 last:border-0">
                        <span className="text-gray-400 font-bold">{item.label}</span>
                        <span className="text-gray-700 text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a href={template.download_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#1F5C3E] text-white py-3 rounded-xl font-bold uppercase text-[12px] tracking-[0.1em] shadow-lg hover:bg-black transition-all no-underline">
                  <span className="text-lg">↓</span> Download for Google Sheets
                </a>
                
                <div className="mt-4 flex justify-center items-center gap-5 text-[11px] font-bold text-gray-400 tracking-tight uppercase">
                  <span className="flex items-center gap-1.5 whitespace-nowrap"><Check size={14} className="text-gray-300" /> No Registration</span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap"><Check size={14} className="text-gray-300" /> Safe & No Macros</span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION SECTION */}
            <div className="max-w-full">
              <div className="border-l-4 border-[#C0DD97] pl-6 mb-6">
                <div className="text-[17px] text-gray-600 leading-snug font-normal prose prose-flat max-w-none">
                    {template.long_description?.split('\n').map((line: string, i: number) => {
                        if (line.includes(':')) {
                            const [boldPart, normalPart] = line.split(':');
                            return <p key={i} className="mb-2"><strong className="text-gray-900 font-bold">{boldPart}:</strong>{normalPart}</p>
                        }
                        return <p key={i} className="mb-2">{line}</p>
                    })}
                </div>
              </div>

              {/* WHAT'S INCLUDED - TITOLI PIÙ GRANDI E BOLD */}
              <div className="mb-8 pr-0">
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#374151] mb-5">What's included</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {featuresList.map((f: string, i: number) => {
                    const hasSeparator = f.includes(':');
                    const title = hasSeparator ? f.split(':')[0] : '';
                    const desc = hasSeparator ? f.split(':')[1] : f;
                    return (
                      <div key={i} className="bg-[#f5f4ed] px-5 py-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center min-h-[110px]">
                        <div className="mb-2">{featureIcons[i] || featureIcons[0]}</div>
                        {title && <h4 className="text-[15px] font-black uppercase mb-1 text-[#454544] tracking-tight leading-tight">{title}</h4>}
                        <p className="text-[11px] text-gray-500 leading-tight font-medium">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HOW TO USE */}
              <div className="mb-12 border-t border-gray-100 pt-6">
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#374151] mb-6">How to use this template</h3>
                <div className="space-y-4">
                  {howToUseSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-6 max-w-4xl">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1F5C3E] text-white text-[11px] font-black shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-[16px] text-gray-600 leading-snug font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* SIDEBAR DESTRA */}
          <aside className="flex-[0.26] w-full sticky top-24 pt-4 flex flex-col gap-10 border-l border-gray-50 pl-8">
            
            {/* VIDEO TUTORIAL */}
            {template.youtube_url && (
              <div>
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-100 shadow-lg mb-3">
                   <iframe
                    width="100%" height="100%"
                    src={`https://www.youtube.com/embed/${template.youtube_url.split('v=')[1]}`}
                    title="YouTube video player" frameBorder="0" allowFullScreen
                  ></iframe>
                </div>
                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#374151]">
                  <MonitorPlay size={16} /> Video Tutorial
                </h4>
              </div>
            )}

            {/* CATEGORIES */}
            <div className="flex flex-col gap-4">
               <div className="bg-[#1F5C3E] text-white py-2 px-4 rounded-md text-center">
                  <span className="text-[11px] font-black uppercase tracking-widest">Categories</span>
               </div>
               
               <div className="relative">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search categories..." 
                    className="w-full bg-[#f5f4ed] border border-gray-100 rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold text-gray-600 focus:ring-1 focus:ring-[#1F5C3E] transition-all"
                  />
                  <Search className="absolute left-3 top-3 text-gray-400" size={14} />
               </div>

               <div className="flex flex-col gap-1 px-1">
                  {filteredCategories.map((cat) => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} className="text-[12px] font-bold text-gray-500 hover:text-[#1F5C3E] no-underline py-1.5 border-b border-gray-50">
                      {cat.name}
                    </Link>
                  ))}
               </div>
            </div>

            {/* SOCIAL */}
            <div className="flex flex-col gap-3">
               <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Follow us on</h4>
               
               <a href="#" className="flex items-center justify-between w-full border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors no-underline">
                  <div className="flex items-center gap-2.5">
                    <PinterestIcon />
                    <span className="text-[12px] font-bold text-gray-700">Pinterest</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase">Follow <ArrowRight size={10} className="inline ml-0.5" /></span>
               </a>

               <a href="#" className="flex items-center justify-between w-full border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors no-underline">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 bg-[#FF0000] rounded-sm flex items-center justify-center text-white text-[8px]">▶</div>
                    <span className="text-[12px] font-bold text-gray-700">YouTube</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase">Subscribe <ArrowRight size={10} className="inline ml-0.5" /></span>
               </a>
            </div>
          </aside>

        </div>
      </div>
      <Footer />

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6 cursor-zoom-out" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={() => setLightboxImg(null)}>
            <X size={32} />
          </button>
          <img src={lightboxImg} className="max-w-full max-h-full rounded-lg shadow-2xl" alt="Enlarged" />
        </div>
      )}
    </div>
  )
}
