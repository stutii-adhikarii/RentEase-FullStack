import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import { bathsLabel, bedsLabel, coverPhoto, formatPrice } from "../format";
import { useFavourites } from "../hooks";

function ApartmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { has, toggle } = useFavourites();
  const [apartment, setApartment] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    "Hi, I'm very interested in this unit. Could we schedule a viewing?",
  );
  const [sent, setSent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setApartment(null);
    setError("");
    api(`/api/apartments/${id}`)
      .then(setApartment)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="container">
        <p className="state-message error">{error}</p>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="container">
        <p className="state-message">Loading listing…</p>
      </div>
    );
  }

  const photos =
    apartment.photos?.length > 0
      ? apartment.photos
      : [coverPhoto(apartment), coverPhoto(apartment), coverPhoto(apartment)];
  const landlord = apartment.landlord;
  const isOwnListing =
    user && String(landlord?._id || landlord) === String(user.id);

  async function handleInquiry(e) {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setSending(true);
    setSent("");
    try {
      await api("/api/inquiries", {
        method: "POST",
        token,
        body: { apartmentId: apartment._id, message },
      });
      setSent("Inquiry sent. You can track it under Inquiries.");
    } catch (err) {
      setSent(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container detail-grid">
      <div>
        <div className="gallery">
          <img className="main" src={photos[0]} alt={apartment.title} />
          <div>
            <img src={photos[1] || photos[0]} alt="" />
            <img src={photos[2] || photos[0]} alt="" style={{ marginTop: 8 }} />
          </div>
        </div>

        <h1>{apartment.title}</h1>
        <p className="muted">{apartment.address}</p>
        <div className="meta">
          <span>{bedsLabel(apartment.bedrooms)}</span>
          <span>{bathsLabel(apartment.bathrooms)}</span>
          {apartment.sqft ? (
            <span>{Number(apartment.sqft).toLocaleString()} sqft</span>
          ) : null}
        </div>

        <h3>About this home</h3>
        <p>{apartment.description}</p>

        <h3>Amenities</h3>
        <div className="amenity-list">
          {(apartment.amenities || []).map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>

      <aside className="side-card">
        <p className="price">{formatPrice(apartment.price)} / month</p>
        <p className="muted">
          {apartment.status === "available" ? "Available Now" : "Rented"}
        </p>
        {isOwnListing ? (
          <Link to={`/listings/${apartment._id}/edit`} className="btn btn-primary btn-wide">
            Edit listing
          </Link>
        ) : (
          <form onSubmit={handleInquiry}>
            <div className="form-row">
              <label className="form-label" htmlFor="inquiry">
                Send Inquiry
              </label>
              <textarea
                id="inquiry"
                className="form-input"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-wide" disabled={sending}>
              {sending ? "Sending…" : "Send Inquiry"}
            </button>
          </form>
        )}
        <button
          type="button"
          className="btn btn-outline btn-wide"
          style={{ marginTop: 8 }}
          onClick={() => toggle(apartment._id)}
        >
          {has(apartment._id) ? "Saved to Favourites" : "Save to Favourites"}
        </button>
        {sent ? <p className="muted">{sent}</p> : null}

        <h3>Landlord</h3>
        <p>{landlord?.fullName || "Property manager"}</p>
        <p className="muted">{landlord?.email}</p>
        <p className="muted">{landlord?.phone}</p>
      </aside>
    </div>
  );
}

export default ApartmentDetailPage;
