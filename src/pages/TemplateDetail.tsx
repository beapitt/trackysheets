import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Footer from '../components/Footer'

// Icona Google Drive coordinata
const GoogleDriveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 87.3 78" className="mr-2">
    <path fill="#0066DA" d="M6.6 66.8l13.4-23.1H74L60.6 66.8z"/>
    <path fill="#00832D" d="M13.4 20.7l13.4 23.1L6.6 66.8 0 55.4z"/>
    <path fill="#FFBA00" d="M26.8 43.8L40.2 20.7 53.6 43.8z"/>
    <path fill="#0066DA" d="M40.2 20.7L53.6 43.8 80.6 43.8 67.2 20.7z"/>
    <path fill="#EA4335" d="M26.8 43.8L13.4 20.7 40.2 20.7z"/>
    <path fill="#00832D" d="M53.6 43.8L67.2 20.7 87.3 55.4 74 78z"/>
  </svg>
);

export default function TemplateDetail() {
  const { slug } = useParams()
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTemplate() {
      const { data } = await supabase
        .from('templates')
        .select('*')
        .eq('slug', slug)
        .single()

      if (data) {
        setTemplate(data)
        setSelectedImg(data.thumbnail)
      }
      setLoading(false)
    }
    fetchTemplate()
  }, [slug])

  if (loading) return <div className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Loading</div>
  if (!template) return <div className="p-20 text-center font-sans text-gray-500">Template not found</div>

  const gallery = [template.thumbnail, template.img_1, template.img_2, template.img_3].filter(Boolean)

  // FUNZIONE MAGICA PER LE LISTE (Indispensabile!)
  const parseList = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      // Se è una stringa che sembra un array JSON ["a", "b"]
      if (data.startsWith('[') && data.endsWith(']')) {
        try { return JSON.parse(data); } catch (e) { }
      }
      // Altrimenti dividi per riga
      return data.split('\n').map(item => item.trim()).filter(item => item !== '');
    }
    return [];
  };

  const featuresList = parseList(template.features);
  const howToUseList = parseList(template.how_to_use);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* LAYOUT ESPANSO (maxWidth 1400 come chiesto) */}
      <div className="max-w-[1400px] mx-auto px-10 py-4">
        
        {/* BREADCRUMB COMPATTO */}
        <nav className="text-[12px] font-medium text-gray-400 mb-6">
          <Link to="/" className="hover:text-brand-green">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{template.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* COLONNA SINISTRA - MAIN CONTENT */}
          <main className="flex-1">
            
            {/* TITOLO RIDOTTO */}
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
              {template.title}
            </h1>

            <div className="grid lg:grid-cols-12 gap-8 mb-12">
              {/* GALLERY LUNGA */}
              <div className="lg:col-span-8">
                <div className="aspect-[16/8] bg-[#f5f4ed] rounded-xl overflow-hidden mb-4 border border-gray-100">
                  <img src={selectedImg || ''} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <div className="flex gap-2">
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImg(img)} 
                      className={`w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedImg === img ? 'border-brand-green' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              </div>

              {/* BOX METADATI COMPATTO E TASTO DOWNLOAD */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-[#f5f4ed] rounded-xl p-5 border border-gray-100">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-green mb-4">Specifications</h4>
                  <div className="space-y-2 text-[12px] font-medium">
                    <div className="flex justify-between border-b border-gray-200/50 pb-2">
                      <span className="text-gray-500">Software</span>
                      <span className="text-gray-900">{template.software || 'Google Sheets'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Difficulty</span>
                      <span className="text-gray-900">{template.difficulty || 'Beginner'}</span>
                    </div>
                  </div>
                </div>

                <a href={template.download_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between w-full bg-brand-green text-white px-5 py-4 rounded-xl font-bold uppercase text-[12px] tracking-wide shadow-lg hover:bg-[#1a4f35] transition-all">
                  <div className="flex items-center"><GoogleDriveIcon /> Download for Sheets</div>
                  <span className="text-lg">↓</span>
                </a>
              </div>
            </div>

            {/* DESCRIZIONE E FEATURE GRID (ORIZZONTALE) */}
            <div className="max-w-4xl">
              <div className="border-l-4 border-brand-green/30 pl-6 mb-12">
                <div 
                  className="text-[18px] text-gray-600 leading-relaxed prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: template.long_description }} 
                />
              </div>

              {/* WHAT'S INCLUDED - BOX CHIARI */}
              <div className="mb-16">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">What's included</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {featuresList.map((f: any, i: number) => (
                    <div key={i} className="bg-[#f5f4ed] p-5 rounded-xl border border-gray-100">
                      <div className="text-xl mb-2">{typeof f === 'object' ? f.icon : '✨'}</div>
                      <h4 className="text-[13px] font-bold uppercase mb-1 text-gray-900">{typeof f === 'object' ? f.title : 'Benefit'}</h4>
                      <p className="text-[12px] text-gray-500 leading-snug">{typeof f === 'object' ? f.description : f}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* HOW TO USE - CERCHI VERDI LIBERI */}
              <div className="mb-20">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 text-center">How to use</h3>
                <div className="space-y-4">
                  {howToUseList.map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-4 py-1">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1F5C3E] text-white text-[10px] font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-[15px] text-gray-600 leading-tight pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* SIDEBAR ALLINEATA */}
          <aside className="lg:w-[260px]">
            <Sidebar />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}
