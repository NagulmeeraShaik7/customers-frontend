import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerApi } from "../../api/customerApi";
import { MdPerson, MdPhone, MdEmail, MdArrowDropDown } from "react-icons/md";
import Spinner from "../common/Spinner";
import "./CustomerForm.css";

const CustomerForm = ({ initialData = {}, isEdit = false, customerId, onCancel }) => {
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
    setSuccess("");
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
    <div className="customer-form-card">
      <h2 className="customer-form-title">{isEdit ? "Edit Customer" : "Add Customer"}</h2>
      {error && (
        <div className="customer-form-error">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="message-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#e53935" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="customer-form-success">
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
        <form onSubmit={handleSubmit} className="customer-form" autoComplete="off">
          <div className="customer-form-group">
            <MdPerson className="input-icon" />
            <input
              className="customer-form-input"
              name="firstName"
              placeholder=" "
              value={form.firstName}
              onChange={handleChange}
              required
              aria-label="First Name"
            />
            <label className="customer-form-label">First Name *</label>
          </div>
          <div className="customer-form-group">
            <MdPerson className="input-icon" />
            <input
              className="customer-form-input"
              name="lastName"
              placeholder=" "
              value={form.lastName}
              onChange={handleChange}
              required
              aria-label="Last Name"
            />
            <label className="customer-form-label">Last Name *</label>
          </div>
          <div className="customer-form-group">
            <MdPhone className="input-icon" />
            <input
              className="customer-form-input"
              name="phone"
              placeholder=" "
              value={form.phone}
              onChange={handleChange}
              required
              aria-label="Phone"
            />
            <label className="customer-form-label">Phone (10 digits) *</label>
          </div>
          <div className="customer-form-group">
            <MdEmail className="input-icon" />
            <input
              className="customer-form-input"
              name="email"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              required
              aria-label="Email"
            />
            <label className="customer-form-label">Email *</label>
          </div>
          <div className="customer-form-group">
            <select
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
              className="customer-select"
              aria-label="Account Type"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <MdArrowDropDown className="select-icon" />
          </div>
          <div className="customer-form-actions">
            <button
              type="button"
              className="customer-form-cancel"
              onClick={handleCancel}
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="customer-form-btn"
              disabled={loading}
            >
              {isEdit ? "Save" : "Add Customer"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomerForm;