import { useAuth } from "../AuthContext";
import { getFavouriteIds } from "../favourites";
import { useInquiries } from "../hooks";

function ProfilePage() {
  const { user, token } = useAuth();
  const saved = getFavouriteIds().length;
  const { inquiries } = useInquiries(token);
  const active = inquiries.filter((item) => item.status !== "closed").length;

  return (
    <div className="container profile-grid">
      <aside className="panel">
        <h1>{user.fullName}</h1>
        <p className="muted">{user.email}</p>
        <p className="muted">{user.phone}</p>
        <p className="badge" style={{ position: "static", display: "inline-block" }}>
          {user.role}
        </p>
        <div className="stats" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
          <div className="stat">
            <p className="muted">Saved Favourites</p>
            <h2>{saved}</h2>
          </div>
          <div className="stat">
            <p className="muted">Active Inquiries</p>
            <h2>{active}</h2>
          </div>
        </div>
      </aside>
      <div className="panel">
        <h2>Recent Activity</h2>
        {inquiries.length === 0 ? (
          <p className="muted">
            Saved listings and inquiries will show up here as you use Rent Ease.
          </p>
        ) : (
          inquiries.slice(0, 6).map((item) => (
            <p key={item._id}>
              {item.status === "pending" ? "Inquired about" : "Updated"}{" "}
              {item.apartment?.title || "a listing"}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
