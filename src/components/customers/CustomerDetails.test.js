import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CustomerDetails from "./CustomerDetails";
import { customerApi } from "../../api/customerApi";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// ✅ Mock child components
jest.mock("../addresses/AddressList", () => () => (
  <div data-testid="address-list">AddressList Component</div>
));
jest.mock("./OnlyOneAddressToggle", () => () => (
  <div data-testid="toggle">OnlyOneAddressToggle Component</div>
));
jest.mock("../common/Spinner", () => () => (
  <div data-testid="spinner">Loading...</div>
));

// ✅ Mock customerApi
jest.mock("../../api/customerApi", () => ({
  customerApi: {
    getById: jest.fn(),
  },
}));

describe("CustomerDetails Component", () => {
  const mockCustomer = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    phone: "1234567890",
    email: "john@example.com",
    accountType: "premium",
    hasOnlyOneAddress: true,
    addresses: [
      { id: 101, line1: "123 Street", city: "Hyderabad", state: "Telangana" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders spinner initially", async () => {
    // Mock unresolved promise (loading state)
    customerApi.getById.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/customer/1"]}>
        <Routes>
          <Route path="/customer/:id" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("renders customer info, toggle, and addresses after API call", async () => {
    customerApi.getById.mockResolvedValue({ data: { data: mockCustomer } });

    render(
      <MemoryRouter initialEntries={["/customer/1"]}>
        <Routes>
          <Route path="/customer/:id" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // ✅ Wait for API data to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // ✅ Verify customer info
    expect(screen.getByText(/Phone:/)).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText(/Account Type:/)).toBeInTheDocument();
    expect(screen.getByText("premium")).toBeInTheDocument();

    // ✅ Verify mocked children
    expect(screen.getByTestId("toggle")).toBeInTheDocument();
    expect(screen.getByTestId("address-list")).toBeInTheDocument();
  });

  test("calls customerApi.getById with correct ID", async () => {
    customerApi.getById.mockResolvedValue({ data: { data: mockCustomer } });

    render(
      <MemoryRouter initialEntries={["/customer/1"]}>
        <Routes>
          <Route path="/customer/:id" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(customerApi.getById).toHaveBeenCalledWith("1");
    });
  });
});
