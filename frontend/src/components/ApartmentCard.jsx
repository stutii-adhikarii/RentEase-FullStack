import { Link } from "react-router-dom";
import { bathsLabel, bedsLabel, coverPhoto, formatPrice } from "../format";

function ApartmentCard({ apartment, favourite, onToggleFavourite, actions }) {
  const tag = apartment.tags?.[0] || (apartment.isFeatured ? "Featured" : null);

  return (
    <article className="apartment-card">
      <div className="card-image-wrap">
        <img src={coverPhoto(apartment)} alt={apartment.title} />
        {tag ? <span className="badge">{tag}</span> : null}
        {apartment.status === "rented" ? (
          <span className="badge rented" style={{ left: tag ? "108px" : "12px" }}>
            Rented
          </span>
        ) : null}
        {onToggleFavourite ? (
          <button
            type="button"
            className="heart"
            aria-label="Save to favourites"
            onClick={() => onToggleFavourite(apartment._id)}
          >
            {favourite ? "♥" : "♡"}
          </button>
        ) : null}
      </div>

      <div className="card-body">
        <h3 className="card-title">{apartment.title}</h3>
        <p className="muted">
          {apartment.address}
          {apartment.neighborhood ? `, ${apartment.neighborhood}` : ""}
        </p>
        <p className="price">{formatPrice(apartment.price)}/mo</p>
        <div className="meta">
          <span>{bedsLabel(apartment.bedrooms)}</span>
          <span>{bathsLabel(apartment.bathrooms)}</span>
          {apartment.sqft ? <span>{Number(apartment.sqft).toLocaleString()} sqft</span> : null}
        </div>
        <div className="card-actions">
          <Link to={`/apartments/${apartment._id}`} className="btn btn-outline">
            View Details
          </Link>
          {actions}
        </div>
      </div>
    </article>
  );
}

export default ApartmentCard;
