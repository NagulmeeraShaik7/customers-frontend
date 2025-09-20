/*eslint-disable*/
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomerForm from "./CustomerForm";
import { customerApi } from "../../api/customerApi";
import { MemoryRouter } from "react-router-dom";

// ✅ Mock Spinner
jest.mock("../common/Spinner", () => () => <div data-testid="spinner">Loading...</div>);

// ✅ Mock customerApi
jest.mock("../../api/customerApi", () => ({
  customerApi: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));

// ✅ Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("CustomerForm Component", () => {
  test("renders Add Customer form by default", () => {
    render(
      <MemoryRouter>
        <CustomerForm />
      </MemoryRouter>
    );

    // Title check
    expect(
      screen.getByRole("heading", { name: /Add Customer/i })
    ).toBeInTheDocument();

    // Submit button check
    expect(
      screen.getByRole("button", { name: /Add Customer/i })
    ).toBeInTheDocument();
  });
});