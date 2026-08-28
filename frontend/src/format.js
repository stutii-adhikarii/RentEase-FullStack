export function formatPrice(value) {
  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return "$0";
  }
  return `$${amount.toLocaleString()}`;
}

export function bedsLabel(bedrooms) {
  const count = Number(bedrooms);
  if (count === 0) {
    return "Studio";
  }
  return `${count} ${count === 1 ? "Bed" : "Beds"}`;
}

export function bathsLabel(bathrooms) {
  const count = Number(bathrooms);
  return `${count} ${count === 1 ? "Bath" : "Baths"}`;
}

export function coverPhoto(apartment) {
  if (apartment?.photos?.length > 0) {
    return apartment.photos[0];
  }
  return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80";
}

export function listingToForm(apartment) {
  return {
    title: apartment.title || "",
    address: apartment.address || "",
    neighborhood: apartment.neighborhood || "",
    price: apartment.price === undefined ? "" : String(apartment.price),
    bedrooms: apartment.bedrooms === undefined ? "1" : String(apartment.bedrooms),
    bathrooms: apartment.bathrooms === undefined ? "1" : String(apartment.bathrooms),
    sqft: apartment.sqft === undefined || apartment.sqft === null ? "" : String(apartment.sqft),
    type: apartment.type || "apartment",
    description: apartment.description || "",
    amenities: apartment.amenities || [],
    photosText: (apartment.photos || []).join("\n"),
    availableFrom: apartment.availableFrom
      ? String(apartment.availableFrom).slice(0, 10)
      : "",
    status: apartment.status || "available",
  };
}

export function formToListing(form) {
  const photos = form.photosText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    title: form.title,
    address: form.address,
    neighborhood: form.neighborhood,
    price: Number(form.price),
    bedrooms: Number(form.bedrooms),
    bathrooms: Number(form.bathrooms),
    sqft: form.sqft === "" ? undefined : Number(form.sqft),
    type: form.type,
    description: form.description,
    amenities: form.amenities,
    photos,
    availableFrom: form.availableFrom || undefined,
    status: form.status,
  };
}
