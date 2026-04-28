import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import { 
  LayoutGrid, Zap, BarChart3, Check, 
  MonitorPlay, Search, ArrowRight 
} from 'lucide-react'

export default function TemplateDetail() {
  const { slug } = useParams()
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      // Fetch Template
      const { data: tData } = await supabase.from('templates').select('*').eq('slug', slug).single()
      if (tData) {
        setTemplate(tData)
        setSelectedImg(tData.thumbnail)
      }
      
      // Fetch Categories per la Sidebar
      const { data: cData } = await supabase.from('categories').select('*').order('name')
      if (cData) setCategories(cData)
      
      setLoading(false)
    }
    fetchData()
  }, [slug])

  if (loading) return <div className="p-20 text-center font-bold text-gray-300 uppercase tracking-widest">Loading...</div>
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
  
  // Testi Step Allungati e Professionali
  const howToUseSteps = [
    "Click the download button to access the official Google Sheets template link and create your personal copy.",
    "Open the file in your Google account and follow the setup instructions to customize categories and initial settings.",
    "Start tracking your data daily to get real-time visual insights and automated financial reports instantly."
  ];

  const featureIcons = [
    <LayoutGrid size={20} strokeWidth={2.5} className="text-[#1F5C3E]" />, 
    <Zap size={20} strokeWidth={2.5} className="text-[#1F5C3E]" />, 
    <BarChart3 size={20} strokeWidth={2.5} className="text-[#1F5C3E]" />
  ];

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans">
      <Navbar />

      <div className="w-full max-w-[1550px] mx-auto px-12 py-8">
        
        {/* BREADCRUMB */}
        <nav className="text-[11px] font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">
          <Link to="/" className="hover:text-[#1F5C3E] no-underline">Home</Link>
          <span className="mx-3 text-gray-200">/</span>
          <span className="text-gray-600">{template.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-14 items-start">
          
          {/* COLONNA SINISTRA (MAIN) */}
          <main className="flex-[0.74] w-full">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 leading-tight uppercase">
                  {template.title}
                </h1>
                <p className="text-xl text-gray-400 font-medium tracking-tight">
                    {template.short_description}
                </p>
            </div>

            <div className="grid xl:grid-cols-12 gap-10 mb-10">
              <div className="xl:col-span-8">
                <div className="aspect-[21/9] bg-[#f5f4ed] rounded-xl overflow-hidden mb-5 border border-gray-100 shadow-sm">
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

              {/* DOWNLOAD BOX */}
              <div className="xl:col-span-4 flex flex-col">
                <div className="bg-[#f5f4ed] rounded-xl p-6 border border-gray-100 mb-4 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-5">Technical Specifications</h4>
                  <div className="space-y-3 text-[12px]">
                    {[
                      { label: 'Software', value: template.software || 'Google Sheets' },
                      { label: 'License', value: 'Personal Use Only' },
                      { label: 'Format', value: template.file_format || 'Instant Copy' },
                      { label: 'Access', value: 'No Login Required' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-200/40 pb-2.5 last:border-0">
                        <span className="text-gray-500 font-bold">{item.label}</span>
                        <span className="text-[#4b5563] font-black text-right uppercase">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a href={template.download_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#1F5C3E] text-white py-4 rounded-xl font-bold uppercase text-[12px] tracking-[0.1em] shadow-lg hover:bg-black transition-all no-underline">
                  <span className="text-lg">↓</span> Download for Google Sheets
                </a>
                
                <div className="mt-4 flex justify-center items-center gap-4 text-[10.5px] font-extrabold text-[#4b5563] tracking-tight">
                  <span className="flex items-center gap-1.5 whitespace-nowrap uppercase">✓ No Registration</span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap uppercase">✓ Safe & No Macros</span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="max-w-full">
              <div className="border-l-4 border-[#C0DD97] pl-10 mb-10">
                <div className="text-[18px] text-gray-600 leading-snug font-normal prose prose-flat max-w-none">
                    {template.long_description.split('\n').map((line: string, i: number) => {
                        if (line.includes(':')) {
                            const [boldPart, normalPart] = line.split(':');
                            return <p key={i} className="mb-2"><strong className="text-gray-900 font-bold">{boldPart}:</strong>{normalPart}</p>
                        }
                        return <p key={i} className="mb-2">{line}</p>
                    })}
                </div>
              </div>

              {/* WHAT'S INCLUDED (BOX AFFUSOLATI) */}
              <div className="mb-10">
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#374151] mb-6">What's included</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {featuresList.map((f: string, i: number) => {
                    const [title, desc] = f.includes(':') ? f.split(':') : ['Highlight', f];
                    return (
                      <div key={i} className="bg-[#f5f4ed] px-5 py-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center min-h-[110px]">
                        <div className="mb-2">{featureIcons[i] || featureIcons[0]}</div>
                        <h4 className="text-[12px] font-black uppercase mb-1 text-gray-900 tracking-tight">{title}</h4>
                        <p className="text-[11px] text-gray-500 leading-tight font-medium">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HOW TO USE (STEP LUNGHI) */}
              <div className="mb-16">
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#374151] mb-8">How to use this template</h3>
                <div className="space-y-4">
                  {howToUseSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-5">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1F5C3E] text-white text-[11px] font-black shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-[15px] text-gray-600 leading-tight pt-1 font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* SIDEBAR DESTRA (ORDINE CLAUDE) */}
          <aside className="flex-[0.26] w-full sticky top-24 pt-4 flex flex-col gap-10">
            
            {/* 1. VIDEO TUTORIAL */}
            {template.youtube_url && (
              <div>
                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#374151] mb-4">
                  <MonitorPlay size={16} /> Video Tutorial
                </h4>
                <div className="aspect-video bg-[#f5f4ed] rounded-xl overflow-hidden border border-gray-100 shadow-md">
                   <iframe
                    width="100%" height="100%"
                    src={`https://www.youtube.com/embed/${template.youtube_url.split('v=')[1]}`}
                    title="YouTube video player" frameBorder="0" allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* 2. CATEGORIES SECTION */}
            <div className="flex flex-col gap-4">
               <div className="bg-[#1F5C3E] text-white py-2 px-4 rounded-md">
                  <span className="text-[11px] font-black uppercase tracking-widest">Categories</span>
               </div>
               
               {/* Search Bar */}
               <div className="relative">
                  <input 
                    type="text" placeholder="Search categories..." 
                    className="w-full bg-[#f5f4ed] border-none rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold text-gray-600 focus:ring-1 focus:ring-[#1F5C3E]"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
               </div>

               {/* Categories List */}
               <div className="flex flex-col gap-1 px-1">
                  {categories.map((cat) => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} className="text-[12px] font-bold text-gray-500 hover:text-[#1F5C3E] no-underline py-1 border-b border-gray-50">
                      {cat.name}
                    </Link>
                  ))}
               </div>
            </div>

            {/* 3. FOLLOW US ON (BOTTONI SOCIAL) */}
            <div className="flex flex-col gap-3">
               <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Follow us on</h4>
               
               {/* Pinterest Button */}
               <a href="https://pinterest.com" target="_blank" rel="noreferrer" 
                 className="flex items-center justify-between w-full border border-gray-200 rounded-full px-4 py-2.5 hover:bg-gray-50 transition-colors no-underline">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#E60023] rounded-full flex items-center justify-center text-white text-[10px] font-black">P</div>
                    <span className="text-[12px] font-black text-[#E60023]">Pinterest</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase">Follow <ArrowRight size={10} className="inline ml-1" /></span>
               </a>

               {/* YouTube Button */}
               <a href="https://youtube.com" target="_blank" rel="noreferrer" 
                 className="flex items-center justify-between w-full border border-gray-200 rounded-full px-4 py-2.5 hover:bg-gray-50 transition-colors no-underline">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#FF0000] rounded-sm flex items-center justify-center text-white text-[8px]">▶</div>
                    <span className="text-[12px] font-black text-gray-900">YouTube</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase">Subscribe <ArrowRight size={10} className="inline ml-1" /></span>
               </a>
            </div>
          </aside>

        </div>
      </div>
      <Footer />
    </div>
  )
}
