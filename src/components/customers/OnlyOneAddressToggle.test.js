/*eslint-disable*/
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OnlyOneAddressToggle from "./OnlyOneAddressToggle";
import { customerApi } from "../../api/customerApi";

// mock API
jest.mock("../../api/customerApi", () => ({
  customerApi: {
    markOnlyOneAddress: jest.fn(),
  },
}));

describe("OnlyOneAddressToggle Component", () => {
  const customerId = "123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders enabled toggle when exactly one address", () => {
    render(
      <OnlyOneAddressToggle
        customerId={customerId}
        initialValue={true}
        addresses={[{ id: 1 }]}
      />
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeEnabled();
    expect(checkbox).toBeChecked();
    expect(
      screen.queryByText(/\(Can only enable if exactly one address exists\)/i)
    ).not.toBeInTheDocument();


  });

  test("renders disabled toggle and hint when not exactly one address", () => {
    render(
      <OnlyOneAddressToggle
        customerId={customerId}
        initialValue={false}
        addresses={[{ id: 1 }, { id: 2 }]}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
    expect(
      screen.getByText(/\(Can only enable if exactly one address exists\)/i)
    ).toBeInTheDocument();
  });

  test("toggles checkbox successfully and calls API", async () => {
    customerApi.markOnlyOneAddress.mockResolvedValueOnce({});

    render(
      <OnlyOneAddressToggle
        customerId={customerId}
        initialValue={false}
        addresses={[{ id: 1 }]}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(customerApi.markOnlyOneAddress).toHaveBeenCalledWith(
        customerId,
        true
      );
      expect(checkbox).toBeChecked();
    });
  });

  test("shows error message when API fails", async () => {
    customerApi.markOnlyOneAddress.mockRejectedValueOnce({
      response: { data: { message: "API failed" } },
    });

    render(
      <OnlyOneAddressToggle
        customerId={customerId}
        initialValue={false}
        addresses={[{ id: 1 }]}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(
        screen.getByText(/API failed/i)
      ).toBeInTheDocument();
    });
  });
});
