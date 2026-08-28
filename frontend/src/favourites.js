const KEY = "rentease-favourites";

function readIds() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getFavouriteIds() {
  return readIds();
}

export function isFavourite(id) {
  return readIds().includes(id);
}

export function toggleFavourite(id) {
  const current = readIds();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
