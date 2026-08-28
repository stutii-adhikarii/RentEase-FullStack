import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApartmentCard from "../components/ApartmentCard";
import { PROPERTY_TYPES } from "../constants";
import { useApartments, useFavourites } from "../hooks";

function HomePage() {
  const navigate = useNavigate();
  const { apartments, error, loading } = useApartments("/api/apartments");
  const { has, toggle } = useFavourites();
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [type, setType] = useState("");

  const featured = useMemo(() => {
    const picked = apartments.filter((item) => item.isFeatured);
    return (picked.length > 0 ? picked : apartments).slice(0, 3);
  }, [apartments]);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    if (budget === "low") {
      params.set("maxPrice", "2500");
    } else if (budget === "mid") {
      params.set("minPrice", "2000");
      params.set("maxPrice", "4000");
    } else if (budget === "high") {
      params.set("minPrice", "4000");
    }
    navigate(`/apartments?${params.toString()}`);
  }

  return (
    <div className="container">
      <section className="hero">
        <h1>Find your next perfect home</h1>
        <p>
          Experience simple, transparent apartment hunting. Browse curated
          listings, connect directly with landlords, and secure your new space
          with ease.
        </p>
      </section>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          aria-label="Location"
        />
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          aria-label="Budget"
        >
          <option value="">Budget</option>
          <option value="low">Under $2,500</option>
          <option value="mid">$2,000 – $4,000</option>
          <option value="high">$4,000+</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Type"
        >
          <option value="">Type</option>
          {PROPERTY_TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Featured Apartments</h2>
            <p className="muted">Handpicked premium living spaces</p>
          </div>
          <Link to="/apartments">View All Listings →</Link>
        </div>

        {loading ? <p className="state-message">Loading listings…</p> : null}
        {error ? (
          <p className="state-message error">
            Could not load listings. Start the backend and set MONGO_URI. ({error})
          </p>
        ) : null}
        {!loading && !error && featured.length === 0 ? (
          <p className="state-message">No apartments found</p>
        ) : null}

        <div className="cards">
          {featured.map((apartment) => (
            <ApartmentCard
              key={apartment._id}
              apartment={apartment}
              favourite={has(apartment._id)}
              onToggleFavourite={toggle}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <h3>Search</h3>
            <p className="muted">
              Browse our curated collection of verified premium listings tailored
              to your preferences.
            </p>
          </div>
          <div className="step">
            <h3>Connect</h3>
            <p className="muted">
              Message property managers directly through our platform to schedule
              viewings or ask questions.
            </p>
          </div>
          <div className="step">
            <h3>Rent</h3>
            <p className="muted">
              Apply securely online, sign your lease digitally, and get ready to
              move into your new home.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
