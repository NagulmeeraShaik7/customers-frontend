import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddressForm from "./AddressForm";

// Helper to wrap component with Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("AddressForm Component", () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    mockSubmit.mockReset();
    mockCancel.mockReset();
  });

  test("renders form with initial values", () => {
    const initialData = {
      line1: "Street 1",
      line2: "Street 2",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      pincode: "500081",
      isPrimary: true,
      status: "active",
    };

    renderWithRouter(<AddressForm initialData={initialData} onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/Address Line 1/i)).toHaveValue("Street 1");
    expect(screen.getByLabelText(/Address Line 2/i)).toHaveValue("Street 2");
    expect(screen.getByLabelText(/City/i)).toHaveValue("Hyderabad");
    expect(screen.getByLabelText(/State/i)).toHaveValue("Telangana");
    expect(screen.getByLabelText(/Country/i)).toHaveValue("India");
    expect(screen.getByLabelText(/Pincode/i)).toHaveValue("500081");
    expect(screen.getByLabelText(/Primary Address/i)).toBeChecked();
    expect(screen.getByLabelText(/Status/i)).toHaveValue("active");
  });

  test("submits form correctly", async () => {
    renderWithRouter(<AddressForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/Address Line 1/i), { target: { value: "Street 123" } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "Hyderabad" } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: "Telangana" } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: "India" } });
    fireEvent.change(screen.getByLabelText(/Pincode/i), { target: { value: "500081" } });
    fireEvent.click(screen.getByLabelText(/Primary Address/i));
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: "inactive" } });

    fireEvent.click(screen.getByRole("button", { name: /Add Address/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        line1: "Street 123",
        line2: "",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        pincode: "500081",
        isPrimary: true,
        status: "inactive",
      });
    });
  });

  test("displays success message after successful submission", async () => {
    mockSubmit.mockResolvedValueOnce({});
    renderWithRouter(<AddressForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/Address Line 1/i), { target: { value: "Street 123" } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "Hyderabad" } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: "Telangana" } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: "India" } });
    fireEvent.change(screen.getByLabelText(/Pincode/i), { target: { value: "500081" } });

    fireEvent.click(screen.getByRole("button", { name: /Add Address/i }));

    await waitFor(() => {
      expect(screen.getByText(/Address saved successfully/i)).toBeInTheDocument();
    });
  });

  test("displays error message when submission fails", async () => {
    mockSubmit.mockRejectedValueOnce(new Error("Submission failed"));
    renderWithRouter(<AddressForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/Address Line 1/i), { target: { value: "Street 123" } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "Hyderabad" } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: "Telangana" } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: "India" } });
    fireEvent.change(screen.getByLabelText(/Pincode/i), { target: { value: "500081" } });

    fireEvent.click(screen.getByRole("button", { name: /Add Address/i }));

    await waitFor(() => {
      expect(screen.getByText(/Submission failed/i)).toBeInTheDocument();
    });
  });

  test("calls onCancel prop when cancel button is clicked", () => {
    renderWithRouter(<AddressForm onCancel={mockCancel} />);

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockCancel).toHaveBeenCalled();
  });
});
