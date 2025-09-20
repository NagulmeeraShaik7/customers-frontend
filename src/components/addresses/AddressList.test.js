/*eslint-disable*/

import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import AddressList from "./AddressList";
import { customerApi } from "../../api/customerApi";

// -----------------------
// Mock customerApi
// -----------------------
jest.mock("../../api/customerApi", () => ({
  customerApi: {
    addAddress: jest.fn(() => Promise.resolve()),
    updateAddress: jest.fn(() => Promise.resolve()),
    deleteAddress: jest.fn(() => Promise.resolve()),
  },
}));

// -----------------------
// Mock AddressForm
// -----------------------
jest.mock("./AddressForm", () => ({ onSubmit, initialData, buttonText }) => (
  <div>
    <button onClick={() => onSubmit({ line1: "Test Line1" })}>{buttonText}</button>
  </div>
));

// -----------------------
// Mock window.location.reload
// -----------------------
beforeAll(() => {
  Object.defineProperty(window, "location", {
    value: { ...window.location, reload: jest.fn() },
    writable: true,
  });
});

// -----------------------
// Tests
// -----------------------
describe("AddressList Component", () => {
  const customerProps = {
    customerId: 1,
    addresses: [
      {
        id: 101,
        line1: "123 Main St",
        line2: "Apt 4B",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        pincode: "500081",
        status: "Active",
        isPrimary: true,
      },
    ],
    phone: "1234567890",
    email: "test@test.com",
    accountType: "premium",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders addresses correctly", () => {
    render(<AddressList {...customerProps} />);
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("Hyderabad")).toBeInTheDocument();
    expect(screen.getByText("Primary")).toBeInTheDocument();
  });

  test("adds a new address", async () => {
    render(<AddressList {...customerProps} addresses={[]} />);
    await act(async () => {
      fireEvent.click(screen.getByText("Add Address"));
    });
    expect(customerApi.addAddress).toHaveBeenCalledWith(1, { line1: "Test Line1" });
  });

  test("updates an existing address", async () => {
    render(<AddressList {...customerProps} />);
    await act(async () => {
      fireEvent.click(screen.getByText("Edit"));
    });
    await act(async () => {
      fireEvent.click(screen.getByText("Update Address"));
    });
    expect(customerApi.updateAddress).toHaveBeenCalledWith(1, 101, { line1: "Test Line1" });
  });

  test("deletes an address", async () => {
    render(<AddressList {...customerProps} />);
    await act(async () => {
      fireEvent.click(screen.getByText("Delete"));
    });
    expect(customerApi.deleteAddress).toHaveBeenCalledWith(1, 101);
  });

test("cancels editing", async () => {
    render(<AddressList {...customerProps} />);
    await act(async () => {
    fireEvent.click(screen.getByText("Edit"));
    });
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Update Address")).not.toBeInTheDocument();
});

test("displays message when no addresses", () => {
    render(<AddressList {...customerProps} addresses={[]} />);
    expect(screen.getByText("No addresses found.")).toBeInTheDocument();
});
});
