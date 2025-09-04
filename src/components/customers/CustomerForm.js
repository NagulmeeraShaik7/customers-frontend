
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerApi } from "../../api/customerApi";
import "./CustomerForm.css";

// Example SVG icons for customer fields
const UserIcon = () => (
  <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="8" r="4" stroke="#1976d2" strokeWidth="2" fill="none"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4" stroke="#1976d2" strokeWidth="2" fill="none"/></svg>
);
const PhoneIcon = () => (
  <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" stroke="#1976d2" strokeWidth="2" fill="none"/></svg>
);
const EmailIcon = () => (
  <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#1976d2" strokeWidth="2" fill="none"/><path d="M3 7l9 6 9-6" stroke="#1976d2" strokeWidth="2" fill="none"/></svg>
);

const CustomerForm = ({ initialData = {}, isEdit = false, customerId }) => {
  const [form, setForm] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    phone: initialData.phone || "",
    email: initialData.email || "",
    accountType: initialData.accountType || "standard",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!/^\d{10}$/.test(form.phone)) return "Phone must be 10 digits.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Invalid email format.";
    return "";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isEdit && customerId) {
        await customerApi.update(customerId, form);
        setSuccess("Customer updated successfully.");
      } else {
        await customerApi.create(form);
        setSuccess("Customer created successfully.");
      }
      setTimeout(() => navigate("/customers"), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        (isEdit ? "Failed to update customer." : "Failed to create customer.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form-card" autoComplete="off">
      <div className="customer-form-title">{isEdit ? "Edit Customer" : "Add Customer"}</div>
      <div className="customer-form-group">
        <span className="input-icon"><UserIcon /></span>
        <input
          className="customer-form-input"
          name="firstName"
          placeholder=" "
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <label className="customer-form-label">First Name *</label>
      </div>
      <div className="customer-form-group">
        <span className="input-icon"><UserIcon /></span>
        <input
          className="customer-form-input"
          name="lastName"
          placeholder=" "
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <label className="customer-form-label">Last Name *</label>
      </div>
      <div className="customer-form-group">
        <span className="input-icon"><PhoneIcon /></span>
        <input
          className="customer-form-input"
          name="phone"
          placeholder=" "
          value={form.phone}
          onChange={handleChange}
          required
        />
        <label className="customer-form-label">Phone (10 digits) *</label>
      </div>
      <div className="customer-form-group">
        <span className="input-icon"><EmailIcon /></span>
        <input
          className="customer-form-input"
          name="email"
          placeholder=" "
          value={form.email}
          onChange={handleChange}
          required
        />
        <label className="customer-form-label">Email *</label>
      </div>
      <select name="accountType" value={form.accountType} onChange={handleChange} className="address-select" style={{marginBottom:'0.7rem'}}>
        <option value="standard">Standard</option>
        <option value="premium">Premium</option>
        <option value="enterprise">Enterprise</option>
      </select>
      <div className="address-form-actions">
        <button className="address-form-btn" type="submit" disabled={loading}>
          {loading ? (isEdit ? "Saving..." : "Adding...") : (isEdit ? "Save" : "Add Customer")}
        </button>
      </div>
      {error && <div className="address-form-error">{error}</div>}
      {success && <div className="address-form-success">{success}</div>}
    </form>
  );
};

export default CustomerForm;
