// localStorage bisa melempar error (mode privat Safari, storage penuh, diblokir).
// Wrapper ini membuat game tetap berjalan; progress hanya tidak tersimpan.
export const safeStorage = {
  getItem(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  setItem(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* abaikan */ }
  },
  removeItem(key) {
    try { window.localStorage.removeItem(key); } catch { /* abaikan */ }
  },
};
