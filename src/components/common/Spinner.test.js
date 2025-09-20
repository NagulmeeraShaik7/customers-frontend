/*eslint-disable*/

import React from "react";
import { render } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner Component", () => {
  test("renders spinner overlay", () => {
    const { container } = render(<Spinner />);
    const overlay = container.querySelector(".spinner-overlay");
    expect(overlay).toBeInTheDocument();
  });

  test("renders spinner element inside overlay", () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector(".spinner");
    expect(spinner).toBeInTheDocument();
  });

  test("renders double bounce elements inside spinner", () => {
    const { container } = render(<Spinner />);
    const doubleBounce1 = container.querySelector(".double-bounce1");
    const doubleBounce2 = container.querySelector(".double-bounce2");

    expect(doubleBounce1).toBeInTheDocument();
    expect(doubleBounce2).toBeInTheDocument();
  });
});
