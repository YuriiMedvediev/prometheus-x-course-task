const LS_KEYS = {
  USER_NAME: 'userName',
  CART: 'cart',
};

class LocalStorageService {
  static getItem(key) {
    const value = window.localStorage.getItem(key);

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  static setItem(key, value) {
    return window.localStorage.setItem(key, JSON.stringify(value));
  }

  static removeItem(key) {
    return window.localStorage.removeItem(key);
  }
}

export { LocalStorageService, LS_KEYS };
