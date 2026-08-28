import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { coverPhoto, formatPrice } from "../format";
import { useApartments, useInquiries } from "../hooks";

function DashboardPage() {
  const { token } = useAuth();
  const { apartments, error, loading } = useApartments("/api/apartments/mine", token);
  const { inquiries } = useInquiries(token);
  const available = apartments.filter((item) => item.status === "available").length;
  const rented = apartments.filter((item) => item.status === "rented").length;
  const mostViewed = [...apartments].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
  const pendingCount = inquiries.filter((item) => item.status === "pending").length;

  return (
    <div className="container">
      <section className="hero">
        <h1>Dashboard Overview</h1>
        <p>Manage your properties and inquiries efficiently.</p>
      </section>

      {loading ? <p className="state-message">Loading dashboard…</p> : null}
      {error ? <p className="state-message error">{error}</p> : null}

      <div className="stats">
        <div className="stat">
          <p className="muted">Total Listings</p>
          <h2>{apartments.length}</h2>
        </div>
        <div className="stat">
          <p className="muted">Available Units</p>
          <h2>{available}</h2>
        </div>
        <div className="stat">
          <p className="muted">Rented Units</p>
          <h2>{rented}</h2>
        </div>
        <div className="stat">
          <p className="muted">New Inquiries</p>
          <h2>{pendingCount}</h2>
        </div>
      </div>

      <div className="dashboard-grid" style={{ paddingTop: 24 }}>
        <div className="panel">
          <h3>Recent Activity</h3>
          {inquiries.length === 0 ? (
            <p className="muted">No recent inquiries yet.</p>
          ) : (
            inquiries.slice(0, 5).map((item) => (
              <p key={item._id}>
                New inquiry for {item.apartment?.title || "a listing"} —{" "}
                {item.tenant?.fullName}
              </p>
            ))
          )}
          <Link to="/inquiries">View All Activity</Link>
        </div>
        <div>
          <div className="panel" style={{ background: "var(--teal)", color: "#fff" }}>
            <h3>Add a New Listing</h3>
            <p>Expand your portfolio and reach more verified renters quickly.</p>
            <Link to="/listings/new" className="btn" style={{ background: "#fff", color: "var(--teal)" }}>
              Create Listing
            </Link>
          </div>
          {mostViewed ? (
            <div className="panel" style={{ marginTop: 12, padding: 0, overflow: "hidden" }}>
              <img src={coverPhoto(mostViewed)} alt={mostViewed.title} style={{ height: 180, width: "100%", objectFit: "cover" }} />
              <div style={{ padding: 16 }}>
                <p className="muted">MOST VIEWED PROPERTY</p>
                <h3>{mostViewed.title}</h3>
                <p>{formatPrice(mostViewed.price)}/mo</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
