
import React, { useEffect, useState } from "react";
import AddressForm from "../components/addresses/AddressForm";
import { customerApi } from "../api/customerApi";

const AddAddressPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    customerApi.list({ limit: 100 }).then(res => {
      setCustomers(res.data.data || []);
    });
  }, []);

  const handleSubmit = async (address) => {
    setError("");
    setSuccess("");
    if (!selectedCustomer) {
      setError("Please select a customer.");
      return;
    }
    try {
      await customerApi.addAddress(selectedCustomer, address);
      setSuccess("Address added successfully!");
    } catch (err) {
      setError("Failed to add address.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Add Address</h2>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="customer-select">Select Customer: </label>
          <select
            id="customer-select"
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
            required
            className="address-select"
            style={{ marginBottom: 16 }}
          >
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName} ({c.email})
              </option>
            ))}
          </select>
      </div>
      <AddressForm onSubmit={handleSubmit} />
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default AddAddressPage;
