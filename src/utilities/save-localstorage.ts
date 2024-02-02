export function saveLocalStorage(key: LocalStorageKey, value: string) {
  localStorage.setItem(key, value);
}

export function getLocalStorage(key: LocalStorageKey) {
  return localStorage.getItem(key);
}

export function removeLocalStorage(key: LocalStorageKey) {
  localStorage.removeItem(key);
}

export type LocalStorageKey =
  | 'guide'
  | 'display-position'
  | 'last-window-position';
