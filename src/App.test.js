import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import { customerApi } from "./api/customerApi";

// Mock APIs
jest.mock("./api/customerApi", () => ({
  customerApi: { getById: jest.fn() },
}));

// Mock components
jest.mock("./components/customers/CustomerList", () => () => <div>CustomerList</div>);
jest.mock("./components/customers/CustomerForm", () => ({ isEdit, initialData }) =>
  <div>{isEdit ? `EditForm ${initialData?.id}` : "New CustomerForm"}</div>
);
jest.mock("./components/customers/CustomerDetails", () => () => <div>CustomerDetails</div>);
jest.mock("./pages/AddAddressPage", () => () => <div>AddAddressPage</div>);
jest.mock("./pages/ErrorPage", () => ({ code, message }) => <div>{`Error ${code}: ${message}`}</div>);
jest.mock("./components/common/Spinner", () => () => <div>Loading...</div>);

// Mock BrowserRouter to avoid nested router error
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    BrowserRouter: ({ children }) => <>{children}</>, // Just render children
  };
});

describe("App Component", () => {
  test("renders navigation buttons", () => {

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Add Customer/i)).toBeInTheDocument();
    expect(screen.getByText(/Customers/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Address/i)).toBeInTheDocument();

  });

  test("renders default route (CustomerList)", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/CustomerList/i)).toBeInTheDocument();
  });

  test("renders AddAddressPage route", () => {
    render(
      <MemoryRouter initialEntries={["/addresses/new"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/AddAddressPage/i)).toBeInTheDocument();
  });

  test("renders CustomerForm route for new customer", () => {
    render(
      <MemoryRouter initialEntries={["/customers/new"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/New CustomerForm/i)).toBeInTheDocument();
  });

  test("renders CustomerDetails route", () => {
    render(
      <MemoryRouter initialEntries={["/customers/123"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/CustomerDetails/i)).toBeInTheDocument();
  });

  test("renders 404 page for unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Error 404: Page not found./i)).toBeInTheDocument();
  });

  test("CustomerFormEditWrapper shows loading and then edit form", async () => {
    customerApi.getById.mockResolvedValueOnce({ data: { data: { id: "123" } } });

    render(
      <MemoryRouter initialEntries={["/customers/123/edit"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    const editForm = await screen.findByText(/EditForm 123/i);
    expect(editForm).toBeInTheDocument();
  });

  test("renders ErrorPageWrapper with query params", () => {
    render(
      <MemoryRouter initialEntries={["/error?code=401&message=Unauthorized"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Error 401: Unauthorized/i)).toBeInTheDocument();
  });
});
