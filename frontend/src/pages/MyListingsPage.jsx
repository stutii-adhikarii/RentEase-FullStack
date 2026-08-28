import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApartmentCard from "../components/ApartmentCard";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import { formToListing, listingToForm } from "../format";
import { useApartments } from "../hooks";

function MyListingsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { apartments, error, loading, reload } = useApartments(
    "/api/apartments/mine",
    token,
  );
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return apartments.filter((item) => {
      const statusOk = status === "all" || item.status === status;
      const haystack = `${item.title} ${item.address}`.toLowerCase();
      const queryOk = query.trim() === "" || haystack.includes(query.toLowerCase());
      return statusOk && queryOk;
    });
  }, [apartments, status, query]);

  const availableCount = apartments.filter((item) => item.status === "available").length;
  const rentedCount = apartments.filter((item) => item.status === "rented").length;

  async function handleDelete(apartment) {
    if (!window.confirm(`Delete ${apartment.title}?`)) {
      return;
    }
    await api(`/api/apartments/${apartment._id}`, { method: "DELETE", token });
    reload();
  }

  async function handleToggleStatus(apartment) {
    const nextStatus = apartment.status === "available" ? "rented" : "available";
    const form = listingToForm(apartment);
    await api(`/api/apartments/${apartment._id}`, {
      method: "PUT",
      token,
      body: formToListing({ ...form, status: nextStatus }),
    });
    reload();
  }

  return (
    <div className="container">
      <section className="hero">
        <div className="section-head">
          <div>
            <h1>My Listings</h1>
            <p>Manage your properties, availability, and new posts.</p>
          </div>
          <Link to="/listings/new" className="btn btn-primary">
            + Add New Apartment
          </Link>
        </div>
      </section>

      <div className="page-toolbar">
        <div className="chips">
          <button
            type="button"
            className={status === "all" ? "chip on" : "chip"}
            onClick={() => setStatus("all")}
          >
            All Properties ({apartments.length})
          </button>
          <button
            type="button"
            className={status === "available" ? "chip on" : "chip"}
            onClick={() => setStatus("available")}
          >
            Available ({availableCount})
          </button>
          <button
            type="button"
            className={status === "rented" ? "chip on" : "chip"}
            onClick={() => setStatus("rented")}
          >
            Rented ({rentedCount})
          </button>
        </div>
        <input
          className="form-input"
          style={{ maxWidth: 260 }}
          placeholder="Search addresses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? <p className="state-message">Loading listings…</p> : null}
      {error ? <p className="state-message error">{error}</p> : null}

      <div className="cards">
        {visible.map((apartment) => (
          <ApartmentCard
            key={apartment._id}
            apartment={apartment}
            actions={
              <>
                <button
                  type="button"
                  className="btn"
                  onClick={() => navigate(`/listings/${apartment._id}/edit`)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => handleToggleStatus(apartment)}
                >
                  {apartment.status === "available" ? "Mark rented" : "Mark available"}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(apartment)}
                >
                  Delete
                </button>
              </>
            }
          />
        ))}
        <article className="apartment-card" style={{ borderStyle: "dashed" }}>
          <div className="card-body" style={{ minHeight: 220, justifyContent: "center" }}>
            <h3>List a New Property</h3>
            <p className="muted">Start a listing and reach verified renters.</p>
            <Link to="/listings/new" className="btn btn-primary">
              Start Listing
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

export default MyListingsPage;
