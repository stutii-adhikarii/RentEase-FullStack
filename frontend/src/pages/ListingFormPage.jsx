import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListingForm from "../components/ListingForm";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import { EMPTY_LISTING } from "../constants";
import { formToListing, listingToForm } from "../format";

function ListingFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(EMPTY_LISTING);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    api(`/api/apartments/${id}`)
      .then((apartment) => {
        setInitialValues(listingToForm(apartment));
        setReady(true);
      })
      .catch((err) => setError(err.message));
  }, [id, isEditing]);

  async function handleSubmit(form) {
    setError("");
    try {
      const body = formToListing(form);
      if (isEditing) {
        await api(`/api/apartments/${id}`, { method: "PUT", token, body });
      } else {
        await api("/api/apartments", { method: "POST", token, body });
      }
      navigate("/my-listings");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!ready) {
    return (
      <div className="container">
        <p className="state-message">Loading listing…</p>
      </div>
    );
  }

  return (
    <div className="container">
      {error ? <p className="state-message error">{error}</p> : null}
      <ListingForm
        key={isEditing ? id : "new"}
        initialValues={initialValues}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/my-listings")}
      />
    </div>
  );
}

export default ListingFormPage;
