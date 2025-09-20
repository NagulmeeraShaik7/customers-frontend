import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { customerApi } from "../../api/customerApi";
import { MdEmail, MdEdit, MdDelete, MdVisibility, MdPeople, MdSearch } from "react-icons/md";
import Spinner from "../common/Spinner";
import "./CustomerList.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState({
    q: "",
    city: "",
    state: "",
    pincode: "",
    page: 1,
    limit: 5,
    sortBy: "createdAt",
    sortDir: "DESC",
  });
  const [meta, setMeta] = useState({ total: 0, pages: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await customerApi.list(query);
      setCustomers(res.data.data || []);
      setMeta(res.data.meta || { total: 0, pages: 0 });
    } catch (err) {
      setError("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
  };

  const clearFilters = () => {
    setQuery({
      q: "",
      city: "",
      state: "",
      pincode: "",
      page: 1,
      limit: 5,
      sortBy: "createdAt",
      sortDir: "DESC",
    });
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await customerApi.remove(deleteModal.id);
      setSuccess("Customer deleted successfully.");
      setDeleteModal({ show: false, id: null });
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete customer.");
      setDeleteModal({ show: false, id: null });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteModal({ show: true, id });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, id: null });
  };

  const handleView = (id) => {
    setNavigating(true);
    setTimeout(() => {
      navigate(`/customers/${id}`);
    }, 500); // Simulate slight delay for spinner visibility
  };

  return (
    <div className="customer-list-container">
      <h2 className="customer-list-title">
        <MdPeople size={28} color="#1976d2" />
        Customers
      </h2>

      <div className="customer-list-filters search-filter-row">
        <div className="search-input-wrapper">
          <MdSearch size={20} className="search-icon" />
          <input
            className="search-input"
            name="q"
            placeholder="Search by name, email, city, state, pincode..."
            value={query.q}
            onChange={handleChange}
            aria-label="Search customers"
          />
        </div>
        <button
          className="add-customer-btn clear-btn"
          onClick={clearFilters}
          aria-label="Clear filters"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Clear
        </button>
      </div>

      <div className="customer-list-filters search-filter-row">
        <span className="advanced-dropdown">
          <select
            name="sortBy"
            value={query.sortBy}
            onChange={handleChange}
            aria-label="Sort by"
          >
            <option value="createdAt">Created At</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
          </select>
        </span>
        <span className="advanced-dropdown">
          <select
            name="sortDir"
            value={query.sortDir}
            onChange={handleChange}
            aria-label="Sort direction"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </span>
      </div>

      {error && (
        <div className="error-message">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="message-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#dc2626" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="success-message">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="message-icon">
            <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l8.6-8.6 1.4 1.4L9 16.2z" fill="#16a34a" />
          </svg>
          {success}
        </div>
      )}
      {loading || navigating ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Account Type</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Pincode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-customers">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((c) => {
                const addr = c.addresses?.[0] || {};
                return (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{`${c.firstName} ${c.lastName}`}</td>
                    <td>{c.phone || '-'}</td>
                    <td>
                      <span className="email-cell">
                        <MdEmail size={16} color="#1976d2" />
                        {c.email}
                      </span>
                    </td>
                    <td>
                      <span className={`account-type-badge ${c.accountType}`}>
                        {c.accountType.charAt(0).toUpperCase() + c.accountType.slice(1)}
                      </span>
                    </td>
                    <td>{addr.line1 || '-'}</td>
                    <td>{addr.city || '-'}</td>
                    <td>{addr.state || '-'}</td>
                    <td>{addr.pincode || '-'}</td>
                    <td className="customer-actions">
                      <button
                        className="icon-btn"
                        title="View"
                        onClick={() => handleView(c.id)}
                        aria-label={`View customer ${c.id}`}
                      >
                        <MdVisibility size={20} color="#1976d2" />
                      </button>
                      <button
                        className="icon-btn"
                        title="Edit"
                        onClick={() => navigate(`/customers/${c.id}/edit`)}
                        aria-label={`Edit customer ${c.id}`}
                      >
                        <MdEdit size={20} color="#1976d2" />
                      </button>
                      <button
                        className="icon-btn"
                        title="Delete"
                        onClick={() => openDeleteModal(c.id)}
                        aria-label={`Delete customer ${c.id}`}
                      >
                        <MdDelete size={20} color="#e53935" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button className="modal-close-btn" onClick={closeDeleteModal} aria-label="Close modal">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this customer? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-btn-cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={query.page <= 1}
          onClick={() => setQuery((prev) => ({ ...prev, page: prev.page - 1 }))}
          aria-label="Previous page"
        >
          ← Prev
        </button>
        <span aria-label={`Page ${query.page} of ${meta.pages}`}>
          Page {query.page} of {meta.pages}
        </span>
        <button
          className="pagination-btn"
          disabled={query.page >= meta.pages}
          onClick={() => setQuery((prev) => ({ ...prev, page: prev.page + 1 }))}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default CustomerList;