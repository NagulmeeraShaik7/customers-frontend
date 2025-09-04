import "./CustomerDetails.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { customerApi } from "../../api/customerApi";
import AddressList from "../addresses/AddressList";
import OnlyOneAddressToggle from "./OnlyOneAddressToggle";

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    customerApi.getById(id).then(res => {
      console.log('API getById:', res.data.data);
      setCustomer(res.data.data);
    });
  }, [id]);


  // Debug: log the customer object to the console
  if (customer) {
    // eslint-disable-next-line no-console
    console.log('CustomerDetails:', customer);
  }

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="customer-details-container">
      <div className="customer-info-card">
        <h2>{customer.firstName} {customer.lastName}</h2>
        <div><span className="info-label">Phone:</span> <span className="info-value">{customer.phone}</span></div>
        <div><span className="info-label">Email:</span> <span className="info-value">{customer.email}</span></div>
        <div><span className="info-label">Account Type:</span> <span className="info-value">{customer.accountType}</span></div>
      </div>

      {/* ✅ Toggle */}
      <OnlyOneAddressToggle
        customerId={id}
        initialValue={customer.hasOnlyOneAddress || false}
        addresses={customer.addresses || []}
      />

      {/* ✅ Addresses */}
      <AddressList
        customerId={id}
        addresses={customer.addresses || []}
        phone={customer.phone}
        email={customer.email}
        accountType={customer.accountType}
      />
    </div>
  );
};

export default CustomerDetails;
