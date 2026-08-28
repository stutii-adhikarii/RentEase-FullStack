import { useState } from "react";
import { AMENITIES, PROPERTY_TYPES } from "../constants";

function validate(form) {
  const errors = {};

  if (form.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  }
  if (form.address.trim() === "") {
    errors.address = "Address is required";
  }
  if (form.price === "" || Number(form.price) < 0) {
    errors.price = "Enter a valid monthly rent";
  }
  if (form.description.trim().length < 20) {
    errors.description = "Please write at least 20 characters";
  }

  return errors;
}

function ListingForm({ initialValues, isEditing, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleAmenity(name) {
    setForm((prev) => {
      const hasIt = prev.amenities.includes(name);
      return {
        ...prev,
        amenities: hasIt
          ? prev.amenities.filter((item) => item !== name)
          : [...prev.amenities, name],
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    onSubmit(form);
  }

  return (
    <form className="listing-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">
        {isEditing ? "Edit listing" : "Add New Listing"}
      </h2>

      <div className="form-grid">
        <div className="form-row">
          <label className="form-label" htmlFor="title">
            Listing Title
          </label>
          <input
            id="title"
            name="title"
            className="form-input"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title ? <span className="form-error">{errors.title}</span> : null}
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="address">
            Location
          </label>
          <input
            id="address"
            name="address"
            className="form-input"
            value={form.address}
            onChange={handleChange}
          />
          {errors.address ? (
            <span className="form-error">{errors.address}</span>
          ) : null}
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="neighborhood">
            Neighborhood
          </label>
          <input
            id="neighborhood"
            name="neighborhood"
            className="form-input"
            value={form.neighborhood}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="price">
            Monthly Rent ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            className="form-input"
            value={form.price}
            onChange={handleChange}
          />
          {errors.price ? <span className="form-error">{errors.price}</span> : null}
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="availableFrom">
            Available From
          </label>
          <input
            id="availableFrom"
            name="availableFrom"
            type="date"
            className="form-input"
            value={form.availableFrom}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            name="type"
            className="form-input"
            value={form.type}
            onChange={handleChange}
          >
            {PROPERTY_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="bedrooms">
            Bedrooms
          </label>
          <select
            id="bedrooms"
            name="bedrooms"
            className="form-input"
            value={form.bedrooms}
            onChange={handleChange}
          >
            <option value="0">Studio</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4+</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="bathrooms">
            Bathrooms
          </label>
          <select
            id="bathrooms"
            name="bathrooms"
            className="form-input"
            value={form.bathrooms}
            onChange={handleChange}
          >
            <option value="1">1</option>
            <option value="1.5">1.5</option>
            <option value="2">2</option>
            <option value="2.5">2.5</option>
            <option value="3">3</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="sqft">
            Square Footage
          </label>
          <input
            id="sqft"
            name="sqft"
            type="number"
            min="0"
            className="form-input"
            value={form.sqft}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="form-input"
            value={form.status}
            onChange={handleChange}
          >
            <option value="available">Available</option>
            <option value="rented">Rented</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="form-input"
          rows={5}
          value={form.description}
          onChange={handleChange}
        />
        {errors.description ? (
          <span className="form-error">{errors.description}</span>
        ) : null}
      </div>

      <div>
        <p className="form-label">Facilities & Amenities</p>
        <div className="chips">
          {AMENITIES.map((name) => (
            <button
              key={name}
              type="button"
              className={form.amenities.includes(name) ? "chip on" : "chip"}
              onClick={() => toggleAmenity(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" htmlFor="photosText">
          Photo URLs (one per line — first image is the cover)
        </label>
        <textarea
          id="photosText"
          name="photosText"
          className="form-input"
          rows={4}
          value={form.photosText}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div className="card-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Save Changes" : "Save Listing"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ListingForm;
