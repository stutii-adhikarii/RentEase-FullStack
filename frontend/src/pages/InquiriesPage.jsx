import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import { coverPhoto } from "../format";
import { useInquiries } from "../hooks";

function lastMessage(inquiry) {
  const messages = inquiry.messages || [];
  return messages[messages.length - 1];
}

function InquiriesPage() {
  const { user, token } = useAuth();
  const [status, setStatus] = useState("all");
  const [replyById, setReplyById] = useState({});
  const { inquiries, error, loading, reload } = useInquiries(token, status);

  const [actionError, setActionError] = useState("");

  async function handleReply(inquiry) {
    const text = (replyById[inquiry._id] || "").trim();
    if (!text) {
      return;
    }
    setActionError("");
    try {
      await api(`/api/inquiries/${inquiry._id}/reply`, {
        method: "POST",
        token,
        body: { message: text },
      });
      setReplyById((prev) => ({ ...prev, [inquiry._id]: "" }));
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleArchive(inquiry) {
    setActionError("");
    try {
      await api(`/api/inquiries/${inquiry._id}`, {
        method: "PUT",
        token,
        body: { archived: true },
      });
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <div className="container">
      <section className="hero">
        <div className="section-head">
          <div>
            <h1>{user.role === "landlord" ? "Inquiries Management" : "My Inquiries"}</h1>
            <p>
              {user.role === "landlord"
                ? "Track and reply to messages from prospective renters."
                : "Track and manage your communications with property managers."}
            </p>
          </div>
          <select
            className="form-input"
            style={{ width: 180 }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="responded">Responded</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </section>

      {loading ? <p className="state-message">Loading inquiries…</p> : null}
      {error ? <p className="state-message error">{error}</p> : null}
      {actionError ? <p className="state-message error">{actionError}</p> : null}
      {!loading && !error && inquiries.length === 0 ? (
        <p className="state-message">No inquiries yet</p>
      ) : null}

      {inquiries.map((item) => {
        const apartment = item.apartment;
        const preview = lastMessage(item);
        return (
          <article className="inquiry-card" key={item._id}>
            <img src={coverPhoto(apartment)} alt="" />
            <div>
              <div className="section-head">
                <h3 style={{ margin: 0 }}>{apartment?.title || "Listing"}</h3>
                <span className={`status ${item.status}`}>{item.status}</span>
              </div>
              <p className="muted">{apartment?.address}</p>
              <p>{preview?.body}</p>
              <p className="muted">
                {item.tenant?.fullName} ·{" "}
                {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
              </p>
              {apartment?._id ? (
                <Link to={`/apartments/${apartment._id}`}>View listing →</Link>
              ) : null}

              {item.status !== "closed" ? (
                <div className="form-row" style={{ marginTop: 12 }}>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder={
                      user.role === "landlord" ? "Write a reply…" : "Follow up…"
                    }
                    value={replyById[item._id] || ""}
                    onChange={(e) =>
                      setReplyById((prev) => ({
                        ...prev,
                        [item._id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: 8 }}
                    onClick={() => handleReply(item)}
                  >
                    {user.role === "landlord" ? "Respond" : "Reply"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ marginTop: 8 }}
                  onClick={() => handleArchive(item)}
                >
                  Archive
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default InquiriesPage;
