import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdHome, MdLocationCity, MdMap, MdFlag, MdPin, MdCheckBox, MdArrowDropDown } from "react-icons/md";
import Spinner from "../common/Spinner";
import "./AddressForm.css";

const AddressForm = ({ onSubmit, initialData = {}, buttonText = "Add Address", onCancel }) => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await onSubmit(form);
      setSuccess("Address saved successfully!");
    } catch (err) {
      setError(err?.message || "Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    //console.log("Cancel button clicked, onCancel prop:", onCancel);
    try {
      if (onCancel) {
        //console.log("Executing provided onCancel function");
        onCancel();
      } else {
        //console.log("No onCancel prop, navigating to /customers");
        navigate("/customers"); // Fallback to a specific route
      }
    } catch (err) {
      console.error("Error in handleCancel:", err);
    }
  };

  return (
    <div className="address-form-card">
      <h2 className="address-form-title">{initialData.id ? "Edit Address" : "Add Address"}</h2>
      {error && (
        <div className="address-form-error">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="message-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#e53935" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="address-form-success">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="message-icon">
            <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l8.6-8.6 1.4 1.4L9 16.2z" fill="#388e3c" />
          </svg>
          {success}
        </div>
      )}
      {loading ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="address-form" autoComplete="off">
          <div className="address-form-group">
            <MdHome className="input-icon" />
            <input
              className="address-form-input"
              name="line1"
              placeholder=" "
              value={form.line1}
              onChange={handleChange}
              required
              aria-label="Address Line 1"
            />
            <label className="address-form-label">Address Line 1 *</label>
          </div>
          <div className="address-form-group">
            <MdHome className="input-icon" />
            <input
              className="address-form-input"
              name="line2"
              placeholder=" "
              value={form.line2}
              onChange={handleChange}
              aria-label="Address Line 2"
            />
            <label className="address-form-label">Address Line 2</label>
          </div>
          <div className="address-form-group">
            <MdLocationCity className="input-icon" />
            <input
              className="address-form-input"
              name="city"
              placeholder=" "
              value={form.city}
              onChange={handleChange}
              required
              aria-label="City"
            />
            <label className="address-form-label">City *</label>
          </div>
          <div className="address-form-group">
            <MdMap className="input-icon" />
            <input
              className="address-form-input"
              name="state"
              placeholder=" "
              value={form.state}
              onChange={handleChange}
              required
              aria-label="State"
            />
            <label className="address-form-label">State *</label>
          </div>
          <div className="address-form-group">
            <MdFlag className="input-icon" />
            <input
              className="address-form-input"
              name="country"
              placeholder=" "
              value={form.country}
              onChange={handleChange}
              required
              aria-label="Country"
            />
            <label className="address-form-label">Country *</label>
          </div>
          <div className="address-form-group">
            <MdPin className="input-icon" />
            <input
              className="address-form-input"
              name="pincode"
              placeholder=" "
              value={form.pincode}
              onChange={handleChange}
              required
              aria-label="Pincode"
            />
            <label className="address-form-label">Pincode *</label>
          </div>
          <div className="address-form-group address-form-checkbox">
            <input
              type="checkbox"
              name="isPrimary"
              checked={form.isPrimary}
              onChange={handleChange}
              className="address-form-checkbox-input"
              id="isPrimary"
              aria-label="Primary Address"
            />
            <label htmlFor="isPrimary" className="address-form-checkbox-label">
              <MdCheckBox className="checkbox-icon" />
              Primary Address
            </label>
          </div>
          <div className="address-form-group">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="address-select"
              aria-label="Status"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <MdArrowDropDown className="select-icon" />
          </div>
          <div className="address-form-actions">
            <button
              type="button"
              className="address-form-cancel"
              onClick={handleCancel}
              aria-label="Cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="address-form-btn"
              disabled={loading}
            >
              {buttonText}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressForm;