
import "./AddressList.css";
import React, { useState } from "react";
import { FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { customerApi } from "../../api/customerApi";
import AddressForm from "./AddressForm";

const AddressList = ({ customerId, addresses, phone, email, accountType }) => {
  const [editingAddress, setEditingAddress] = useState(null);
  const [success, setSuccess] = useState("");

  const handleAdd = async (address) => {
    try {
      await customerApi.addAddress(customerId, address);
      setSuccess("Address added successfully!");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      setSuccess("");
    }
  };

  const handleUpdate = async (address) => {
    await customerApi.updateAddress(customerId, editingAddress.id, address);
    setEditingAddress(null);
    window.location.reload();
  };

  const handleDelete = async (addressId) => {
    await customerApi.deleteAddress(customerId, addressId);
    window.location.reload();
  };

  return (
    <div className="address-list-container">
  {/* Customer info card removed to avoid duplicate phone, email, account type */}
      <hr className="address-divider" />
  <h3 className="address-section-title">Addresses</h3>
      {addresses.length === 0 ? (
        <p className="no-addresses">No addresses found.</p>
      ) : (
        <div className="address-cards">
          {addresses.map((a) => (
            <div key={a.id} className="address-card">
              <div className="address-main"><FaMapMarkerAlt className="address-icon" /> {a.line1}</div>
              <div className="address-meta">
                <div><strong>Address Line 2:</strong> {a.line2 || '-'}</div>
                <div><strong>City:</strong> {a.city || '-'}</div>
                <div><strong>State:</strong> {a.state || '-'}</div>
                <div><strong>Country:</strong> {a.country || '-'}</div>
                <div><strong>Pincode:</strong> {a.pincode || '-'}</div>
                <div><strong>Status:</strong> {a.status || '-'}</div>
                {a.isPrimary ? <span className="primary-badge"><FaCheckCircle style={{marginRight:4}}/>Primary</span> : null}
              </div>
              <div className="address-actions">
                <button className="edit-button" onClick={() => setEditingAddress(a)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(a.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingAddress ? (
        <div className="address-form-card">
          <h4>Edit Address</h4>
          <AddressForm
            initialData={editingAddress}
            onSubmit={handleUpdate}
            buttonText="Update Address"
          />
          <button className="cancel-button" onClick={() => setEditingAddress(null)}>Cancel</button>
        </div>
      ) : (
        <div className="address-form-card">
          <h4>Add New Address</h4>
          {success && <div className="address-form-success">{success}</div>}
          <AddressForm onSubmit={handleAdd} buttonText="Add Address" />
        </div>
      )}
    </div>
  );
};

export default AddressList;
