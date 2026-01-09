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
        const url = cloudStorage.resolveUrl('/api/store', base);
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify(data)
        });
        
        if (res.ok) return { success: true };
        
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            lastError = json.error || `HTTP ${res.status}`;
        } catch {
            lastError = `HTTP ${res.status}: ${text.slice(0, 100)}`;
        }
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
