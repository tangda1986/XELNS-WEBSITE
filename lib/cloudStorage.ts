export const cloudStorage = {
  async fetchAll() {
    try {
      const res = await fetch(`/api/store?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('Cloud storage fetch failed (local dev mode?):', e);
      return null;
    }
  },

  async saveAll(data: Record<string, any>) {
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        let errorMsg = `Server error ${res.status}`;
        try {
          const json = await res.json();
          if (json.error) errorMsg += `: ${json.error}`;
        } catch {
          const text = await res.text();
          if (text) errorMsg += `: ${text.slice(0, 100)}`;
        }
        throw new Error(errorMsg);
      }
      return { success: true };
    } catch (e: any) {
      console.warn('Cloud storage save failed:', e);
      return { success: false, error: e.message || 'Unknown error' };
    }
  },

  async initDb() {
    try {
      const res = await fetch(`/api/init-db?t=${Date.now()}`, { cache: 'no-store' });
      return res.ok;
    } catch (e) {
      return false;
    }
  }
};
