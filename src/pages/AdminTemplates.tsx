<div className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
  
  {/* SEO & VIDEO SECTION */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-green-50/30 rounded-xl border border-green-100">
    <div>
      <label className="block text-[10px] font-black text-[#14532d] uppercase tracking-[0.15em] mb-2">SEO Title (Google)</label>
      <input
        type="text"
        value={template.seo_title || ''}
        onChange={(e) => setTemplate({...template, seo_title: e.target.value})}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a8856] outline-none shadow-sm"
        placeholder="Optimized title for search results"
      />
    </div>
    <div>
      <label className="block text-[10px] font-black text-[#14532d] uppercase tracking-[0.15em] mb-2">YouTube Video ID</label>
      <input
        type="text"
        value={template.youtube_url || ''}
        onChange={(e) => setTemplate({...template, youtube_url: e.target.value})}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a8856] outline-none shadow-sm"
        placeholder="Example: dQw4w9WgXcQ"
      />
    </div>
    <div className="md:col-span-2">
      <label className="block text-[10px] font-black text-[#14532d] uppercase tracking-[0.15em] mb-2">Meta Description (SEO)</label>
      <textarea
        value={template.meta_description || ''}
        onChange={(e) => setTemplate({...template, meta_description: e.target.value})}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a8856] outline-none h-20 shadow-sm"
        placeholder="Brief summary for Google search snippets..."
      />
    </div>
  </div>

  {/* TECHNICAL DATA (SOFTWARE SCHEMA) */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
    <div>
      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Price (0 for Free)</label>
      <input
        type="number"
        value={template.price ?? 0}
        onChange={(e) => setTemplate({...template, price: parseFloat(e.target.value)})}
        className="w-full p-3 border border-gray-200 rounded-lg outline-none"
      />
    </div>
    <div>
      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Operating System</label>
      <input
        type="text"
        value={template.software_os || 'Google Sheets'}
        onChange={(e) => setTemplate({...template, software_os: e.target.value})}
        className="w-full p-3 border border-gray-200 rounded-lg outline-none"
      />
    </div>
    <div>
      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">File Format</label>
      <input
        type="text"
        value={template.file_format || 'Google Sheets Spreadsheet'}
        onChange={(e) => setTemplate({...template, file_format: e.target.value})}
        className="w-full p-3 border border-gray-200 rounded-lg outline-none"
      />
    </div>
  </div>

  {/* DESCRIPTIONS WITH HTML SUPPORT */}
  <div className="space-y-6">
    <div>
      <label className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black text-[#1a8856] uppercase tracking-widest">Short Description (Above Images)</span>
        <span className="text-[10px] text-gray-400 font-medium italic">Use &lt;b&gt;text&lt;/b&gt; for bold</span>
      </label>
      <textarea
        value={template.short_description || ''}
        onChange={(e) => setTemplate({...template, short_description: e.target.value})}
        className="w-full p-4 border border-gray-200 rounded-lg h-32 outline-none focus:border-[#1a8856] shadow-inner"
      />
    </div>

    <div>
      <label className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black text-[#1a8856] uppercase tracking-widest">Long Description (Bottom of page)</span>
        <span className="text-[10px] text-gray-400 font-medium italic">Use &lt;b&gt;text&lt;/b&gt; for bold</span>
      </label>
      <textarea
        value={template.long_description || ''}
        onChange={(e) => setTemplate({...template, long_description: e.target.value})}
        className="w-full p-4 border border-gray-200 rounded-lg h-64 outline-none focus:border-[#1a8856] shadow-inner font-mono text-sm"
      />
    </div>
  </div>
</div>
