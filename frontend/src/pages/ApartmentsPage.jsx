import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ApartmentCard from "../components/ApartmentCard";
import { useApartments, useFavourites } from "../hooks";

function ApartmentsPage() {
  const [searchParams] = useSearchParams();
  const { apartments, error, loading } = useApartments("/api/apartments");
  const { has, toggle } = useFavourites();
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [priceRange, setPriceRange] = useState("");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");

  const visible = useMemo(() => {
    return apartments.filter((item) => {
      const haystack = `${item.title} ${item.address} ${item.neighborhood}`.toLowerCase();
      const locationOk =
        location.trim() === "" || haystack.includes(location.toLowerCase());
      const bedsOk =
        bedrooms === "" || Number(item.bedrooms) === Number(bedrooms);
      let priceOk = true;
      if (priceRange === "low") priceOk = item.price < 2500;
      if (priceRange === "mid") priceOk = item.price >= 2000 && item.price <= 4000;
      if (priceRange === "high") priceOk = item.price >= 4000;
      const typeOk =
        !searchParams.get("type") || item.type === searchParams.get("type");
      const min = searchParams.get("minPrice");
      const max = searchParams.get("maxPrice");
      if (min) priceOk = priceOk && item.price >= Number(min);
      if (max) priceOk = priceOk && item.price <= Number(max);
      return locationOk && bedsOk && priceOk && typeOk;
    });
  }, [apartments, location, bedrooms, priceRange, searchParams]);

  return (
    <div className="container">
      <section className="hero">
        <h1>Find your next home.</h1>
        <p>
          Discover premium apartments curated for modern living. Explore
          breathable spaces tailored to your lifestyle.
        </p>
      </section>

      <div className="filter-bar">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          aria-label="Location"
        />
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          aria-label="Price range"
        >
          <option value="">Price range</option>
          <option value="low">Under $2,500</option>
          <option value="mid">$2,000 – $4,000</option>
          <option value="high">$4,000+</option>
        </select>
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          aria-label="Bedrooms"
        >
          <option value="">Bedrooms</option>
          <option value="0">Studio</option>
          <option value="1">1 Bed</option>
          <option value="2">2 Beds</option>
          <option value="3">3 Beds</option>
        </select>
        <button type="button" className="btn btn-primary">
          Filter
        </button>
      </div>

      <section className="section">
        {loading ? <p className="state-message">Loading listings…</p> : null}
        {error ? <p className="state-message error">{error}</p> : null}
        {!loading && visible.length === 0 ? (
          <p className="state-message">No apartments found</p>
        ) : (
          <div className="cards featured-first">
            {visible.map((apartment) => (
              <ApartmentCard
                key={apartment._id}
                apartment={apartment}
                favourite={has(apartment._id)}
                onToggleFavourite={toggle}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ApartmentsPage;
