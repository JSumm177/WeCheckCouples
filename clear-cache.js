/**
 * Utility script to clear Service Worker caches and unregister Service Workers.
 * This can be run in the browser console or integrated into an admin UI.
 */
async function clearAppCache() {
  console.log("Starting cache clearance...");

  try {
    // 1. Delete all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log(`Deleted cache: ${cacheName}`);
      }
      console.log("All caches deleted.");
    } else {
      console.warn("Cache API not supported in this browser.");
    }

    // 2. Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log("Unregistered service worker.");
      }
      console.log("All service workers unregistered.");
    } else {
      console.warn("Service Worker API not supported in this browser.");
    }

    // 3. Reload the page to fetch fresh assets
    console.log("Reloading page to fetch fresh assets...");
    window.location.reload(true);
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
}

// Optional: Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { clearAppCache };
} else if (typeof window !== 'undefined') {
  window.clearAppCache = clearAppCache;
}
