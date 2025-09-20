import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorPage from "./ErrorPage";

describe("ErrorPage Component", () => {
  test("renders with default props", () => {
    render(<ErrorPage />);
    
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("Server Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Go Home/i })).toBeInTheDocument();
  });

  test("renders custom error code and message", () => {
    render(<ErrorPage code={404} message="Page not found!" />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByText("Page not found!")).toBeInTheDocument();
  });

  test("renders correct title for different codes", () => {
    const codes = [
      { code: 400, title: "Bad Request" },
      { code: 401, title: "Unauthorized" },
      { code: 403, title: "Forbidden" },
      { code: 404, title: "Page Not Found" },
      { code: 500, title: "Server Error" },
      { code: 999, title: "Error" }, // fallback
    ];

    codes.forEach(({ code, title }) => {
      render(<ErrorPage code={code} />);
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test("Go Home link points to root path", () => {
    render(<ErrorPage />);
    const link = screen.getByRole("link", { name: /Go Home/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
