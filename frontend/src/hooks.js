import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { getFavouriteIds, toggleFavourite } from "./favourites";

export function useFavourites() {
  const [ids, setIds] = useState(() => getFavouriteIds());

  const toggle = useCallback((id) => {
    setIds(toggleFavourite(id));
  }, []);

  return { ids, toggle, has: (id) => ids.includes(id) };
}

export function useInquiries(token, status = "all") {
  const path =
    status && status !== "all"
      ? `/api/inquiries?status=${encodeURIComponent(status)}`
      : "/api/inquiries";
  const { apartments: inquiries, error, loading, reload, setApartments } =
    useApartments(path, token);
  return {
    inquiries,
    error,
    loading,
    reload,
    setInquiries: setApartments,
  };
}

export function useApartments(path, token) {
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api(path, { token });
      setApartments(data);
    } catch (err) {
      setError(err.message);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  }, [path, token]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { apartments, error, loading, reload, setApartments };
}
