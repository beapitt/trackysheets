useEffect(() => {
    async function fetchCategoryData() {
      setLoading(true)
      console.log("Cercando categoria con slug:", slug);

      // 1. Cerchiamo la categoria
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
      
      if (catError) console.error("Errore categoria:", catError);

      if (catData) {
        setCategory(catData);
        console.log("Categoria trovata:", catData.name, "ID:", catData.id);
        
        // 2. Fetch dei template usando l'ID preciso della categoria
        const { data: tData, error: tError } = await supabase
          .from('templates')
          .select('*')
          .eq('category_id', catData.id)
          .order('created_at', { ascending: false });

        if (tError) console.error("Errore templates:", tError);
        
        if (tData) {
          console.log("Templates trovati:", tData.length);
          setTemplates(tData);
        }
      } else {
        console.warn("Nessuna categoria trovata per lo slug:", slug);
        setTemplates([]);
      }

      // 3. Fetch dati per Sidebar
      const { data: allCats } = await supabase.from('categories').select('*').order('name');
      const { data: sData } = await supabase.from('settings').select('*').maybeSingle();
      
      if (allCats) setCategories(allCats);
      if (sData) setSettings(sData);

      setLoading(false)
    }
    fetchCategoryData()
  }, [slug])
