import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerApi } from "../../api/customerApi";
import "./CustomerList.css";
import Spinner from "../common/Spinner";

// Email icon for table
const EmailIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#1976d2" strokeWidth="2" fill="none"/><path d="M3 7l9 6 9-6" stroke="#1976d2" strokeWidth="2" fill="none"/></svg>
);


// Icon SVGs
const EditIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 21h17M12.5 5.5l6 6-9 9H4v-5.5l8.5-8.5z" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const DeleteIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const ViewIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="#1976d2" strokeWidth="2"/></svg>
);


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
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await customerApi.list(query);
      // API returns { success, data: [...], meta: {...} }
      setCustomers(res.data.data || []);
      setMeta(res.data.meta || { total: 0, pages: 0 });
    } catch (err) {
      setError("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [query]);

  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value, page: 1 });
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await customerApi.remove(id);
      setSuccess("Customer deleted successfully.");
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-list-container">
      <h2 style={{display:'flex',alignItems:'center',gap:8}}>
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1976d2" opacity="0.12"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#1976d2"/></svg>
        Customers
      </h2>

      {/* 🔹 Filters Section */}
      <div className="customer-list-filters search-filter-row">
        <input
          className="search-input"
          name="q"
          placeholder="Search..."
          value={query.q}
          onChange={handleChange}
        />
        <input
          className="filter-input"
          name="city"
          placeholder="City"
          value={query.city}
          onChange={handleChange}
        />
        <input
          className="filter-input"
          name="state"
          placeholder="State"
          value={query.state}
          onChange={handleChange}
        />
        <input
          className="filter-input"
          name="pincode"
          placeholder="Pincode"
          value={query.pincode}
          onChange={handleChange}
        />
        <button className="add-customer-btn" style={{background:'#fff',color:'#1976d2',border:'1.5px solid #1976d2',fontWeight:600}} onClick={clearFilters}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/></svg>
          Clear
        </button>
      </div>

      {/* 🔹 Sorting */}
      <div className="customer-list-filters search-filter-row">
        <span className="advanced-dropdown">
          <select
            name="sortBy"
            value={query.sortBy}
            onChange={handleChange}
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
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </span>
      </div>

      {/* 🔹 Customers Table */}
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: "green", marginBottom: 8 }}>{success}</div>}
      {loading ? (
        <Spinner />
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
            {customers.map((c) => {
              // Try to get the first address if available
              const addr = (c.addresses && c.addresses.length > 0) ? c.addresses[0] : {};
              return (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.firstName} {c.lastName}</td>
                  <td>{c.phone}</td>
                  <td><span style={{display:'flex',alignItems:'center',gap:4}}><EmailIcon />{c.email}</span></td>
                  <td>
                    <span className={`account-type-badge${c.accountType === 'premium' ? ' premium' : c.accountType === 'enterprise' ? ' enterprise' : ''}`}>
                      {c.accountType.charAt(0).toUpperCase() + c.accountType.slice(1)}
                    </span>
                  </td>
                  <td>{addr.line1 || '-'}</td>
                  <td>{addr.city || '-'}</td>
                  <td>{addr.state || '-'}</td>
                  <td>{addr.pincode || '-'}</td>
                  <td className="customer-actions">
                    <button className="icon-btn" title="View" onClick={() => navigate(`/customers/${c.id}`)}><ViewIcon /></button>
                    <button className="icon-btn" title="Edit" onClick={() => navigate(`/customers/${c.id}/edit`)}><EditIcon /></button>
                    <button className="icon-btn" title="Delete" onClick={() => handleDelete(c.id)}><DeleteIcon /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* 🔹 Pagination */}
      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={query.page <= 1}
          onClick={() => setQuery({ ...query, page: query.page - 1 })}
        >
          &#8592; Prev
        </button>
        <span>
          Page {query.page} of {meta.pages}
        </span>
        <button
          className="pagination-btn"
          disabled={query.page >= meta.pages}
          onClick={() => setQuery({ ...query, page: query.page + 1 })}
        >
          Next &#8594;
        </button>
      </div>
    </div>
  );
};

export default CustomerList;
