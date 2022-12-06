class StorageExpireTime {
  private DEFAULT_PREFIX: string = 'est'
  private _storagePrefix: string

  constructor() {
    this._storagePrefix = this.DEFAULT_PREFIX
  }

  setPrefix(prefix: string): void {
    this._storagePrefix = prefix
  }

  _storageKey(key: string): string {
    return `${this._storagePrefix}:${key}`
  }

  _storageKeyExpire(key: string): string {
    return `${this._storagePrefix}:${key}:expired`
  }

  _currentTime(): number {
    return Math.ceil(new Date().getTime() / 1000)
  }

  setItem(key: string, values: any, expiredTime: number = 60 * 60 * 24) {
    const storageKey = this._storageKey(key)
    const storageExpKey = this._storageKeyExpire(key)
    const storageExpiredTime: number = this._currentTime() + expiredTime
    localStorage.setItem(storageKey, values)
    localStorage.setItem(storageExpKey, storageExpiredTime.toString())
  }

  remoteItem(key: string): void {
    const storageKey = this._storageKey(key)
    const storageExpKey = this._storageKeyExpire(key)
    localStorage.removeItem(storageKey)
    localStorage.removeItem(storageExpKey)
  }

  getItem(key: string): string | null {
    const storageKey = this._storageKey(key)
    const storageExpKey = this._storageKeyExpire(key)
    const expiredTime = Number(localStorage.getItem(storageExpKey) || 0)
    let result = localStorage.getItem(storageKey)
    if (expiredTime < this._currentTime()) {
      this.remoteItem(key)
      result = null
    }
    return result
  }
}
