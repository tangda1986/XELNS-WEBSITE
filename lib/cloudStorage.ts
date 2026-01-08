export const cloudStorage = {
  async fetchAll() {
    try {
      const res = await fetch('/api/store');
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
      return res.ok;
    } catch (e) {
      console.warn('Cloud storage save failed:', e);
      return false;
    }
  },

  async initDb() {
    try {
      const res = await fetch('/api/init-db');
      return res.ok;
    } catch (e) {
      return false;
    }
  }
};
