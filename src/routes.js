import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailsPage from "./pages/CustomerDetailsPage";
import AddCustomerPage from "./pages/AddCustomerPage";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/customers/new" element={<AddCustomerPage />} />
      <Route path="/customers/:id" element={<CustomerDetailsPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
