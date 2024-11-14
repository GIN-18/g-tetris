export class IndexedDB {
  constructor(dbName, version, storeName) {
    this.dbName = dbName
    this.version = version
    this.storeName = storeName
    this.db = null
  }

  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'timestamp' })
        }
      }
    })
  }

  close() {
    if (!this.db) return
    this.db.close()
  }

  add(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.add(data)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(id)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  getDataByMode(mode) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.openCursor()
      const data = []

      request.onsuccess = (event) => {
        const cursor = event.target.result

        if (cursor) {
          if (cursor.value.mode === mode) {
            data.push(cursor.value)
          }
          cursor.continue()
        } else {
          resolve(data)
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }
}
