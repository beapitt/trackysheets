import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../layout/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../layout/Sidebar'
import CategoryPills from '../components/CategoryPills'
import { Search } from 'lucide-react'

export default function AllTemplates() {
  const [templates, setTemplates] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchData() {
      const { data: tData } = await supabase
        .from('templates')
        .select('*')
        .order('title', { ascending: true })

      const { data: cData } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (tData) setTemplates(tData)
      if (cData) setCategories(cData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredTemplates = templates.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-left">
      <Navbar />
      
      {/* Pillole delle categorie per navigazione rapida su Mobile */}
      <CategoryPills categories={categories} />

      <div className="w-full max-w-[1550px] mx-auto px-6 md:px-12 py-10 text-left">
        <div className="flex flex-col lg:flex-row items-start gap-12 text-left">
          
          <main className="flex-1 min-w-0 text-left w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h1 className="text-[32px] font-bold text-[#1f2937] uppercase tracking-tight text-left">
                All Templates
              </h1>
              
              {/* Barra di ricerca interna alla pagina */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search all templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1F5C3E]/20 transition-all"
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              </div>
            </div>

            {/* Griglia Adattiva: 1 colonna mobile, 2 tablet (md), 3 desktop (lg) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {filteredTemplates.map((template) => (
                <Link key={template.id} to={`/template/${template.slug}`} className="group no-underline block text-left">
                  <div className="aspect-[16/10] bg-[#f5f4ed] rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300">
                    <img 
                      src={template.thumbnail} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
                      alt={template.title} 
                    />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1 group-hover:text-[#1F5C3E] transition-colors text-left">
                    {template.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#1F5C3E] bg-[#EAF3DE] px-2 py-0.5 rounded uppercase tracking-wider">
                      Free
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Google Sheets
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Messaggio se non ci sono risultati nella ricerca */}
            {filteredTemplates.length === 0 && (
              <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-medium text-sm">No templates found matching your search.</p>
              </div>
            )}
          </main>

          {/* Sidebar: si sposta sotto su mobile grazie a flex-col */}
          <Sidebar />
          
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
