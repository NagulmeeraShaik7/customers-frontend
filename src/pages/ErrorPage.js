import React from "react";
import "./ErrorPage.css";

const ErrorPage = ({ code = 500, message = "Something went wrong!" }) => {
  let title = "Error";
  if (code === 404) title = "Page Not Found";
  else if (code === 400) title = "Bad Request";
  else if (code === 401) title = "Unauthorized";
  else if (code === 403) title = "Forbidden";
  else if (code === 500) title = "Server Error";

  return (
    <div className="error-page-container">
      <div className="error-card">
        <div className="error-code">{code}</div>
        <div className="error-title">{title}</div>
        <div className="error-message">{message}</div>
        <a href="/" className="error-home-btn">Go Home</a>
      </div>
    </div>
  );
};

export default ErrorPage;
