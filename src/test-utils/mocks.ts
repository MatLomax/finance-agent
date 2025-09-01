/**
 * @fileoverview Common test mocks and utilities
 * 
 * Provides properly typed mocks for browser APIs used in tests.
 */

export type MockStorage = Storage & {
  store: Record<string, string>;
}

export function createMockStorage(): MockStorage {
  const store: Record<string, string> = {};
  
  return {
    store,
    length: 0,
    getItem(key: string): string | null {
      return store[key] || null;
    },
    setItem(key: string, value: string): void {
      store[key] = String(value);
    },
    removeItem(key: string): void {
      delete store[key];
    },
    clear(): void {
      Object.keys(store).forEach(key => delete store[key]);
    },
    key(index: number): string | null {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
}

export type MockDocument = {
  documentElement: {
    setAttribute: () => void;
    getAttribute: () => null;
    style: {
      setProperty: () => void;
      getPropertyValue: () => string;
    };
  };
}

export function createMockDocument(): MockDocument {
  return {
    documentElement: {
      setAttribute: () => {},
      getAttribute: () => null,
      style: {
        setProperty: () => {},
        getPropertyValue: () => ''
      }
    }
  };
}
