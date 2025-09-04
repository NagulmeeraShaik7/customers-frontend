import CustomerPage from "./pages/CustomerPage";
import AddAddressPage from "./pages/AddAddressPage";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CustomerList from "./components/customers/CustomerList";
import CustomerForm from "./components/customers/CustomerForm";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { customerApi } from "./api/customerApi";
import CustomerDetails from "./components/customers/CustomerDetails";
import ErrorPage from "./pages/ErrorPage";
import "./App.css";

const NavButtons = () => {
  const navigate = useNavigate();
  return (
    <div className="nav-buttons-row">
      <button className="nav-btn" onClick={() => navigate("/customers") }>
        <span className="nav-btn-icon">👥</span>
        <span className="nav-btn-text">Customers</span>
      </button>
      <button className="nav-btn" onClick={() => navigate("/customers/new") }>
        <span className="nav-btn-icon">➕</span>
        <span className="nav-btn-text">Add Customer</span>
      </button>
      <button className="nav-btn" onClick={() => navigate("/addresses/new") }>
        <span className="nav-btn-icon">🏠</span>
        <span className="nav-btn-text">Add Address</span>
      </button>
    </div>
  );
};

const App = () => {
  // Wrapper for edit route to fetch initial data
  const CustomerFormEditWrapper = () => {
    const { id } = useParams();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
      customerApi.getById(id)
        .then(res => {
          setInitialData(res.data?.data || res.data);
          setLoading(false);
        })
        .catch(err => {
          const code = err?.response?.status || 500;
          const message = err?.response?.data?.message || "Failed to fetch customer.";
          navigate(`/error?code=${code}&message=${encodeURIComponent(message)}`);
        });
    }, [id, navigate]);
    if (loading) return <div>Loading...</div>;
    return <CustomerForm initialData={initialData} isEdit={true} customerId={id} />;
  };

  return (
    <Router>
      <div style={{ padding: "1rem" }}>
        {/* 🔹 Attractive Button Navigation */}
        <NavButtons />

         {/* 🔹 Routes */}
         <Routes>
           <Route path="/" element={<CustomerList />} />
           <Route path="/customers" element={<CustomerList />} />
           <Route path="/customers/new" element={<CustomerForm />} />
           <Route path="/customers/:id" element={<CustomerDetails />} />
           <Route path="/customers/:id/edit" element={<CustomerFormEditWrapper />} />
           <Route path="/customer-page" element={<CustomerPage />} />
           <Route path="/addresses/new" element={<AddAddressPage />} />
           <Route path="/error" element={<ErrorPageWrapper />} />
           <Route path="*" element={<ErrorPage code={404} message="Page not found." />} />
         </Routes>
{/* All customer and address forms/lists are now rendered only via routes above */}
      </div>
    </Router>
  );
};

// Wrapper to extract error code/message from query params
function ErrorPageWrapper() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = parseInt(params.get("code"), 10) || 500;
  const message = params.get("message") || "Something went wrong!";
  return <ErrorPage code={code} message={message} />;
}

export default App;
