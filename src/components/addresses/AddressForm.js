
import "./AddressForm.css";
import React, { useState } from "react";



const AddressForm = ({ onSubmit, initialData = {}, buttonText = "Add Address" }) => {
  const [form, setForm] = useState({
    line1: initialData.line1 || "",
    line2: initialData.line2 || "",
    city: initialData.city || "",
    state: initialData.state || "",
    country: initialData.country || "",
    pincode: initialData.pincode || "",
    isPrimary: initialData.isPrimary || false,
    status: initialData.status || "active",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="address-form-card" autoComplete="off">
      <div className="address-form-title">{initialData.id ? "Edit Address" : "Add Address"}</div>
      <div className="address-form-group">
        <input
          className="address-form-input"
          name="line1"
          placeholder=" "
          value={form.line1}
          onChange={handleChange}
          required
        />
        <label className="address-form-label">Address Line 1 *</label>
      </div>
      <div className="address-form-group">
        <input
          className="address-form-input"
          name="line2"
          placeholder=" "
          value={form.line2}
          onChange={handleChange}
        />
        <label className="address-form-label">Address Line 2</label>
      </div>
      <div className="address-form-group">
        <input
          className="address-form-input"
          name="city"
          placeholder=" "
          value={form.city}
          onChange={handleChange}
          required
        />
        <label className="address-form-label">City *</label>
      </div>
      <div className="address-form-group">
        <input
          className="address-form-input"
          name="state"
          placeholder=" "
          value={form.state}
          onChange={handleChange}
          required
        />
        <label className="address-form-label">State *</label>
      </div>
      <div className="address-form-group">
        <input
          className="address-form-input"
          name="country"
          placeholder=" "
          value={form.country}
          onChange={handleChange}
          required
        />
        <label className="address-form-label">Country *</label>
      </div>
      <div className="address-form-group">
        <input
          className="address-form-input"
          name="pincode"
          placeholder=" "
          value={form.pincode}
          onChange={handleChange}
          required
        />
        <label className="address-form-label">Pincode *</label>
      </div>
      <div className="address-form-group" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          name="isPrimary"
          checked={form.isPrimary}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />
        <label style={{ color: "#1976d2", fontWeight: 500 }}>Primary Address</label>
      </div>
      <select name="status" value={form.status} onChange={handleChange} className="address-select" style={{marginBottom:'0.7rem'}}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <div className="address-form-actions">
        <button className="address-form-btn" type="submit">
          {buttonText}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
