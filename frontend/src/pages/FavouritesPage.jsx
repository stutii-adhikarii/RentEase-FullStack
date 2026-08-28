import { useMemo } from "react";
import ApartmentCard from "../components/ApartmentCard";
import { useApartments, useFavourites } from "../hooks";

function FavouritesPage() {
  const { apartments, error, loading } = useApartments("/api/apartments");
  const { ids, has, toggle } = useFavourites();

  const saved = useMemo(
    () => apartments.filter((item) => ids.includes(item._id)),
    [apartments, ids],
  );

  return (
    <div className="container">
      <section className="hero">
        <h1>My Saved Apartments</h1>
        <p>Review and manage the properties you've favourited.</p>
      </section>
      {loading ? <p className="state-message">Loading listings…</p> : null}
      {error ? <p className="state-message error">{error}</p> : null}
      {!loading && saved.length === 0 ? (
        <p className="state-message">No saved apartments yet</p>
      ) : (
        <div className="cards">
          {saved.map((apartment) => (
            <ApartmentCard
              key={apartment._id}
              apartment={apartment}
              favourite={has(apartment._id)}
              onToggleFavourite={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavouritesPage;
