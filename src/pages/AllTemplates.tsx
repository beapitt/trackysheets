import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { LayoutGrid } from 'lucide-react'

export default function AllTemplates() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllTemplates() {
      // Carica tutti i prodotti ordinati per i più recenti
      const { data } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setTemplates(data)
      setLoading(false)
    }
    fetchAllTemplates()
  }, [])

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-left">
      <Navbar />

      <div className="w-full max-w-[1550px] mx-auto px-12 py-10 text-left">
        <div className="flex flex-row items-start gap-12 text-left">
          
          <main className="flex-1 min-w-0 text-left">
            {/* Header della pagina catalogo */}
            <header className="mb-8 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <LayoutGrid className="text-[#1F5C3E]" size={24} />
                <h1 className="text-[28px] font-bold text-[#1f2937] uppercase tracking-tight">
                  All Templates
                </h1>
              </div>
              <p className="text-[14px] text-[#4b5563]">
                Explore our full library of {templates.length} professional Google Sheets planners.
              </p>
            </header>

            {/* Griglia a 3 colonne (più densa per gestire molti prodotti) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {templates.map((template) => (
                <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block text-left">
                  <div className="aspect-[16/10] bg-[#f5f4ed] rounded-xl overflow-hidden mb-3 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                    <img 
                      src={template.thumbnail} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                      alt={template.title} 
                    />
                  </div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-0.5 group-hover:text-[#1F5C3E] text-left">
                    {template.title}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">
                    Free Download
                  </span>
                </Link>
              ))}
            </div>

            {/* Messaggio se non ci sono ancora molti prodotti */}
            {templates.length === 0 && (
              <p className="text-gray-400 italic text-left">No templates found.</p>
            )}
          </main>

          {/* Sidebar coerente con il resto del sito */}
          <Sidebar />
          
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
