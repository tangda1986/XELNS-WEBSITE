export const cloudStorage = {
  getApiBaseUrl() {
    try {
      const base = (import.meta as any).env?.VITE_CLOUD_API_BASE_URL;
      return typeof base === 'string' ? base : '';
    } catch {
      return '';
    }
  },

  getCandidateBases() {
    const base = cloudStorage.getApiBaseUrl().trim();
    const bases = [base, ''].filter(b => typeof b === 'string');
    return Array.from(new Set(bases));
  },

  resolveUrl(path: string, base: string) {
    if (!base) return path;
    return new URL(path, base).toString();
  },

  async fetchAll() {
    const bases = cloudStorage.getCandidateBases();
    for (const base of bases) {
      try {
        // Try fetching list of keys first (Granular fetch)
        try {
          const listUrl = cloudStorage.resolveUrl(`/api/store?mode=list&t=${Date.now()}`, base);
          const listRes = await fetch(listUrl, { cache: 'no-store' });
          
          if (listRes.ok) {
            const list = await listRes.json();
            if (Array.isArray(list)) {
              const result: Record<string, any> = {};
              // Fetch each key individually
              await Promise.all(list.map(async (item: any) => {
                 try {
                   const keyUrl = cloudStorage.resolveUrl(`/api/store?key=${item.key}&t=${Date.now()}`, base);
                   const r = await fetch(keyUrl, { cache: 'no-store' });
                   if (r.ok) {
                     const val = await r.json();
                     Object.assign(result, val);
                   }
                 } catch (e) {
                   console.warn(`Failed to fetch key ${item.key}`, e);
                 }
              }));
              
              if (Object.keys(result).length > 0) {
                 return result;
              }
            }
          }
        } catch (e) {
           console.warn('Granular fetch failed, attempting bulk fetch', e);
        }

        // Fallback to bulk fetch
        const url = cloudStorage.resolveUrl(`/api/store?t=${Date.now()}`, base);
        const res = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (!res.ok) continue;
        return await res.json();
      } catch (e) {
        console.warn('Cloud storage fetch failed:', e);
      }
    }
    return null;
  },

  async saveAll(data: Record<string, any>): Promise<{ success: boolean; error?: string }> {
    const bases = cloudStorage.getCandidateBases();
    let lastError = 'No connection attempts succeeded';
    
    for (const base of bases) {
      try {
        // Split data into individual keys to avoid payload limits
        const keys = Object.keys(data);
        let allSuccess = true;
        
        // Save sequentially to ensure reliability and avoid connection limits
        for (const key of keys) {
            const payload = { [key]: data[key] };
            try {
                const url = cloudStorage.resolveUrl('/api/store', base);
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                    body: JSON.stringify(payload)
                });
                
                if (!res.ok) {
                    allSuccess = false;
                    const text = await res.text();
                    try {
                        const json = JSON.parse(text);
                        lastError = json.error || `HTTP ${res.status}`;
                    } catch {
                        lastError = `HTTP ${res.status}: ${text.slice(0, 100)}`;
                    }
                    console.error(`Failed to save key ${key}:`, lastError);
                }
            } catch (e) {
                allSuccess = false;
                lastError = e instanceof Error ? e.message : String(e);
                console.error(`Error saving key ${key}:`, e);
            }
        }
        
        if (allSuccess) return { success: true };
        
      } catch (e) {
        console.warn('Cloud storage save failed:', e);
        lastError = e instanceof Error ? e.message : String(e);
      }
    }
    return { success: false, error: lastError };
  },

  async initDb() {
    const bases = cloudStorage.getCandidateBases();
    for (const base of bases) {
      try {
        const url = cloudStorage.resolveUrl(`/api/init-db?t=${Date.now()}`, base);
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) return true;
      } catch (e) {
        console.warn('Cloud db init failed:', e);
      }
    }
    return false;
  },

  async testConnection(): Promise<{ success: boolean; message: string }> {
    const bases = cloudStorage.getCandidateBases();
    const results: string[] = [];
    
    for (const base of bases) {
      try {
        const url = cloudStorage.resolveUrl(`/api/init-db?t=${Date.now()}`, base);
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          return { success: true, message: `连接成功 (${url})` };
        } else {
          const text = await res.text();
          results.push(`失败 ${url}: HTTP ${res.status} - ${text.slice(0, 200)}`);
        }
      } catch (e) {
        results.push(`错误 ${base}: ${e}`);
      }
    }
    return { success: false, message: results.join('\n') || '未知错误' };
  }
};
