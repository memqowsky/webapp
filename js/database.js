// Initialize IndexedDB
const dbName = 'authDB';
const dbVersion = 1;

export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('users')) {
        const store = db.createObjectStore('users', { keyPath: 'username' });
        store.createIndex('username', 'username', { unique: true });
      }
    };
  });
}

export async function registerUser(username, password) {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');

      const user = {
        username,
        password, // In production, this should be hashed!
        createdAt: new Date().toISOString()
      };

      const request = store.add(user);

      request.onsuccess = () => resolve({ success: true });
      request.onerror = () => resolve({ 
        success: false, 
        error: 'Username already exists' 
      });
    });
  } catch (error) {
    return { success: false, error: 'Database error' };
  }
}

export async function loginUser(username, password) {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(username);

      request.onsuccess = () => {
        const user = request.result;
        if (user && user.password === password) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Invalid credentials' });
        }
      };

      request.onerror = () => resolve({ 
        success: false, 
        error: 'Database error' 
      });
    });
  } catch (error) {
    return { success: false, error: 'Database error' };
  }
}