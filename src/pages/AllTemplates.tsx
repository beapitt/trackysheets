import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import { Search, X } from 'lucide-react'

export default function AllTemplates() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  const location = useLocation()

  // Sincronizza la ricerca dall'URL (Navbar)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('search')
    if (query) {
      setSearchTerm(query)
    }
  }, [location.search])

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('templates')
        .select('*')
        .order('title', { ascending: true })
      
      if (data) setTemplates(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredTemplates = templates.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white font-inter text-[#4b5563] antialiased overflow-x-hidden">
      <Navbar />
      
      <main className="max-w-[1440px] mx-auto px-5 md:px-10 pt-6 md:pt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 min-w-0">
            {/* INTESTAZIONE PAGINA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-gray-50 pb-6">
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1F5C3E] mb-1">Library</p>
                <h1 className="text-[26px] md:text-[34px] font-bold text-[#1f2937] leading-tight">
                  {searchTerm ? `Results for: ${searchTerm}` : 'All Templates'}
                </h1>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-2 hover:text-[#1F5C3E] transition-colors"
                  >
                    <X size={14} /> Clear filters
                  </button>
                )}
              </div>
              
              {/* FILTRO LOCALE */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-[#1F5C3E] transition-all font-medium"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>

            {/* GRID TEMPLATES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {filteredTemplates.map((template) => (
                <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block">
                  <div className="aspect-[16/10] bg-[#f9f9f7] rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                    <img 
                      src={template.thumbnail} 
                      className="w-full h-full object-cover" 
                      alt={template.title} 
                    />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#1f2937] mb-1 group-hover:text-[#1F5C3E] transition-colors leading-snug">
                    {template.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-[#1F5C3E] uppercase tracking-widest">
                      Free
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                      Google Sheets
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* NO RESULTS */}
            {filteredTemplates.length === 0 && (
              <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium text-sm">No templates found.</p>
                <button onClick={() => setSearchTerm("")} className="mt-4 text-[#1F5C3E] font-bold text-xs uppercase underline">Show all</button>
              </div>
            )}
          </div>

          {/* SIDEBAR ALLINEATA */}
          <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-24 self-start">
            <Sidebar />
          </aside>
          
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
