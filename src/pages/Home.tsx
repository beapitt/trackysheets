{/* RIGHT: SIDEBAR (MANUS STYLE) */}
        <aside className="w-full md:w-56 shrink-0 order-1 md:order-2">
          
          {/* FOLLOW US ON */}
          <div className="mb-10 px-2">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.15em] border-b border-gray-100 pb-1">
              Follow Us On
            </h3>
            <div className="flex gap-4 items-center">
              {/* Pinterest Minimal */}
              <a href="#" className="text-gray-400 hover:text-[#E60023] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.41 7.63 11.17-.1-.95-.19-2.41.04-3.45.21-.93 1.34-5.69 1.34-5.69s-.34-.69-.34-1.7c0-1.6 1.05-2.8 2.08-2.8.98 0 1.46.74 1.46 1.63 0 .99-.63 2.47-.95 3.84-.27 1.15.58 2.08 1.71 2.08 2.05 0 3.63-2.17 3.63-5.3 0-2.77-1.99-4.71-4.83-4.71-3.3 0-5.23 2.47-5.23 5.02 0 1 .38 2.07.86 2.65.09.11.11.21.08.32-.09.37-.28 1.14-.32 1.29-.05.21-.17.25-.39.15-1.45-.67-2.35-2.8-2.35-4.5 0-3.66 2.66-7.02 7.67-7.02 4.03 0 7.17 2.87 7.17 6.72 0 4.01-2.52 7.23-6.02 7.23-1.18 0-2.28-.61-2.66-1.33l-.72 2.76c-.26 1-1 2.25-1.49 3.05C10.12 23.85 11.03 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg>
              </a>
              {/* YouTube Minimal */}
              <a href="#" className="text-gray-400 hover:text-[#FF0000] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.5c-1.1.3-1.9 1.1-2.2 2.2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.1 1.1 1.9 2.2 2.2 2 1.1 9.3 1.1 9.3 1.1s7.3 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/></svg>
              </a>
            </div>
          </div>

          {/* TEMPLATE CATEGORIES (MANUS STYLE) */}
          <div className="border border-gray-100 rounded-sm p-4 bg-[#FCFDFD]">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.15em] border-b border-gray-100 pb-1">
              Template Categories
            </h3>
            <nav className="flex flex-col">
              <Link to="/" className={`group flex items-center justify-between py-2 text-[12px] no-underline transition-all ${!activeCat ? "text-[#2D5A27] font-bold" : "text-gray-600 hover:text-[#2D5A27]"}`}>
                <span>All Sheets</span>
                <span className="text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">›</span>
              </Link>
              {categories.map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/?cat=${cat.id}`} 
                  className={`group flex items-center justify-between py-2 text-[12px] border-t border-gray-50 no-underline transition-all ${activeCat === cat.id ? "text-[#2D5A27] font-bold" : "text-gray-600 hover:text-[#2D5A27]"}`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] transition-opacity ${activeCat === cat.id ? "opacity-100" : "opacity-30 group-hover:opacity-100"}`}>›</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
