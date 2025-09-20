/*eslint-disable*/
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddAddressPage from "./AddAddressPage";
import { customerApi } from "../api/customerApi";

// Mock API
jest.mock("../api/customerApi", () => ({
  customerApi: {
    list: jest.fn(),
    addAddress: jest.fn(),
  },
}));

// Mock AddressForm to call onSubmit directly
jest.mock("../components/addresses/AddressForm", () => ({ onSubmit }) => {
  return (
    <button
      onClick={() =>
        onSubmit({ line1: "123 Street", city: "City", state: "State", pincode: "12345" })
      }
    >
      Submit Address
    </button>
  );
});

describe("AddAddressPage", () => {
  const customersMock = [
    { id: "1", firstName: "John", lastName: "Doe", email: "john@example.com" },
    { id: "2", firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    customerApi.list.mockResolvedValue({ data: { data: customersMock } });
  });

  test("fetches and renders customers", async () => {
    render(<AddAddressPage />);

    expect(customerApi.list).toHaveBeenCalledWith({ limit: 100 });

    for (const c of customersMock) {
      await waitFor(() => {
        expect(
          screen.getByText(`${c.firstName} ${c.lastName} (${c.email})`)
        ).toBeInTheDocument();
      });
    }
  });

  test("shows error if no customer selected on submit", async () => {
    render(<AddAddressPage />);

    userEvent.click(screen.getByText("Submit Address"));

    await waitFor(() => {
      expect(screen.getByText(/Please select a customer/i)).toBeInTheDocument();
    });
  });

  test("successfully adds address when customer is selected", async () => {
    customerApi.addAddress.mockResolvedValueOnce({});

    render(<AddAddressPage />);

    // Wait for the customer options to render
    const option = await screen.findByText(/John Doe \(john@example.com\)/i);
    const select = screen.getByLabelText(/Select Customer/i);

    userEvent.selectOptions(select, option);

    userEvent.click(screen.getByText("Submit Address"));

    await waitFor(() => {
      expect(customerApi.addAddress).toHaveBeenCalledWith("1", {
        line1: "123 Street",
        city: "City",
        state: "State",
        pincode: "12345",
      });
      expect(screen.getByText(/Address added successfully/i)).toBeInTheDocument();
    });
  });

  test("shows error message if API fails", async () => {
    customerApi.addAddress.mockRejectedValueOnce(new Error("API error"));

    render(<AddAddressPage />);

    // Wait for the customer options to render
    const option = await screen.findByText(/John Doe \(john@example.com\)/i);
    const select = screen.getByLabelText(/Select Customer/i);

    userEvent.selectOptions(select, option);

    userEvent.click(screen.getByText("Submit Address"));

    await waitFor(() => {
      // Ensure API error is displayed
      expect(screen.getByText(/Failed to add address/i)).toBeInTheDocument();
      expect(customerApi.addAddress).toHaveBeenCalledWith("1", {
        line1: "123 Street",
        city: "City",
        state: "State",
        pincode: "12345",
      });
    });
  });
});
