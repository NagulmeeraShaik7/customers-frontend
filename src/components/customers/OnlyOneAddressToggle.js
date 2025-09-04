
import React, { useState } from "react";
import { customerApi } from "../../api/customerApi";

const OnlyOneAddressToggle = ({ customerId, initialValue, addresses = [] }) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const exactlyOne = addresses.length === 1;

  const handleToggle = async () => {
    setError("");
    const newValue = !value;
    try {
      await customerApi.markOnlyOneAddress(customerId, newValue);
      setValue(newValue);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update flag.");
    }
  };

  return (
    <div className="only-one-address-toggle" style={{
      background: '#f8fafc',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.07)',
      padding: '1.2rem 2rem',
      margin: '1.5rem 0 2rem 0',
      maxWidth: 500
    }}>
      <label className="toggle-label" style={{
        display: 'flex', alignItems: 'center', fontWeight: 500, fontSize: '1.08rem', color: '#1976d2', cursor: !exactlyOne ? 'not-allowed' : 'pointer', gap: '0.5rem'
      }}>
        <input
          type="checkbox"
          checked={value}
          onChange={handleToggle}
          disabled={!exactlyOne}
          style={{ accentColor: '#1976d2', width: 20, height: 20, marginRight: 8 }}
        />
        Only allow <span style={{fontWeight:700}}>one address</span> for this customer
      </label>
      {!exactlyOne && (
        <div className="toggle-hint" style={{ color: '#607d8b', fontSize: '0.97rem', marginTop: 4 }}>
          (Can only enable if exactly one address exists)
        </div>
      )}
      {error && <div className="toggle-error" style={{ color: '#e53935', fontSize: '0.97rem', marginTop: 4 }}>{error}</div>}
    </div>
  );
};

export default OnlyOneAddressToggle;
