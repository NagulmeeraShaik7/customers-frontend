/*eslint-disable*/

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CustomerList from "./CustomerList";
import { customerApi } from "../../api/customerApi";

// ✅ Mock API
jest.mock("../../api/customerApi", () => ({
  customerApi: {
    list: jest.fn(),
    remove: jest.fn(),
  },
}));

const mockCustomers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    phone: "1234567890",
    email: "john@example.com",
    accountType: "standard",
    addresses: [
      { line1: "123 Main St", city: "Hyderabad", state: "TS", pincode: "500001" },
    ],
  },
];

describe("CustomerList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders spinner while loading", async () => {
  customerApi.list.mockImplementation(() => new Promise(() => {})); // never resolves

  render(
    <MemoryRouter>
      <CustomerList />
    </MemoryRouter>
  );

  expect(screen.getByText(/Customers/i)).toBeInTheDocument();
  expect(document.querySelector(".spinner-overlay")).toBeInTheDocument();
});


  test("renders customers after API call", async () => {
    customerApi.list.mockResolvedValueOnce({
      data: { data: mockCustomers, meta: { total: 1, pages: 1 } },
    });

    render(
      <MemoryRouter>
        <CustomerList />
      </MemoryRouter>
    );

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Hyderabad")).toBeInTheDocument();
  });

  test("renders error message when API fails", async () => {
    customerApi.list.mockRejectedValueOnce(new Error("API error"));

    render(
      <MemoryRouter>
        <CustomerList />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Failed to fetch customers/i)).toBeInTheDocument();
  });

  test("can clear filters", async () => {
    customerApi.list.mockResolvedValueOnce({
      data: { data: mockCustomers, meta: { total: 1, pages: 1 } },
    });

    render(
      <MemoryRouter>
        <CustomerList />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText("Search customers");
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput.value).toBe("test");

    fireEvent.click(screen.getByLabelText("Clear filters"));
    expect(searchInput.value).toBe("");
  });

  test("shows delete modal and deletes customer successfully", async () => {
    customerApi.list.mockResolvedValue({
      data: { data: mockCustomers, meta: { total: 1, pages: 1 } },
    });
    customerApi.remove.mockResolvedValue({});

    render(
      <MemoryRouter>
        <CustomerList />
      </MemoryRouter>
    );

    const deleteBtn = await screen.findByLabelText("Delete customer 1");
    fireEvent.click(deleteBtn);

    expect(await screen.findByText("Confirm Deletion")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() =>
      expect(screen.getByText(/Customer deleted successfully/i)).toBeInTheDocument()
    );
  });

  test("pagination buttons work", async () => {
    customerApi.list.mockResolvedValue({
      data: { data: mockCustomers, meta: { total: 1, pages: 2 } },
    });

    render(
      <MemoryRouter>
        <CustomerList />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Page 1 of 2/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Next page"));
    expect(await screen.findByText(/Page 2 of 2/i)).toBeInTheDocument();
  });
});
