useEffect(() => {
    async function fetchCategoryData() {
      setLoading(true)
      
      // 1. Cerchiamo la categoria corretta usando lo slug dell'URL
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
      
      if (catData) {
        setCategory(catData)
        
        // 2. MODIFICA: Cerchiamo nella colonna 'category' usando il nome testuale
        // Usiamo catData.name perché nel tuo DB c'è scritto "Budgeting"
        const { data: tData } = await supabase
          .from('templates')
          .select('*')
          .eq('category', catData.name) 
          .order('created_at', { ascending: false })
        
        if (tData) setTemplates(tData)
      }

      const { data: allCats } = await supabase.from('categories').select('*').order('name')
      const { data: sData } = await supabase.from('settings').select('*').maybeSingle()
      
      if (allCats) setCategories(allCats)
      if (sData) setSettings(sData)

      setLoading(false)
    }
    fetchCategoryData()
  }, [slug])
