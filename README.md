# Customers Management Application

A **React.js** application for managing customers and their addresses. This project demonstrates **React Router v6**, **API integration using Axios**, **component-based architecture**, and **unit testing with Jest and React Testing Library**.

---

## Table of Contents

- [Project Structure](#project-structure)  
- [Features](#features)  
- [Installation](#installation)  
- [Available Scripts](#available-scripts)  
- [API Integration](#api-integration)  
- [Testing](#testing)  
- [Components Overview](#components-overview)  
- [License](#license)

---

## Project Structure

```
customers/
├── node_modules/
├── public/
├── src/
│ ├── api/
│ │ └── customerApi.js # Axios API functions
│ ├── components/
│ │ ├── addresses/
│ │ │ ├── AddressForm.js
│ │ │ ├── AddressForm.css
│ │ │ ├── AddressForm.test.js
│ │ │ ├── AddressList.js
│ │ │ ├── AddressList.css
│ │ │ └── AddressList.test.js
│ │ ├── common/
│ │ │ ├── Spinner.js
│ │ │ ├── Spinner.css
│ │ │ └── Spinner.test.js
│ │ └── customers/
│ │ ├── CustomerList.js
│ │ ├── CustomerList.css
│ │ ├── CustomerList.test.js
│ │ ├── CustomerForm.js
│ │ ├── CustomerForm.css
│ │ ├── CustomerForm.test.js
│ │ ├── CustomerDetails.js
│ │ ├── CustomerDetails.css
│ │ ├── CustomerDetails.test.js
│ │ ├── OnlyOneAddressToggle.js
│ │ ├── OnlyOneAddressToggle.css
│ │ └── OnlyOneAddressToggle.test.js
│ ├── pages/
│ │ ├── AddAddressPage.js
│ │ ├── AddAddressPage.test.js
│ │ ├── ErrorPage.js
│ │ ├── ErrorPage.css
│ │ └── ErrorPage.test.js
│ ├── App.js
│ ├── App.css
│ ├── App.test.js
│ ├── index.js
│ ├── index.css
│ ├── reportWebVitals.js
│ └── setupTests.js
├── .gitignore
├── package.json
├── package-lock.json
└── babel.config.js
```


---

## Features

- **Customer Management**: View, add, and edit customers.
- **Address Management**: Add and list addresses for customers.
- **Routing**: React Router v6 for page navigation.
- **Error Handling**: Custom error page for API failures and 404 routes.
- **Loading Indicators**: Spinner component during API calls.
- **Unit Testing**: Jest and React Testing Library for component and page testing.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/NagulmeeraShaik7/customers-frontend.git
cd customers

```

 **2.Install dependencies:**
```
npm install
```

**3.Start the development server:**

```
npm start
```

# Available Scripts

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm start`     | Runs the app in development mode           |
| `npm run build` | Builds the app for production              |
| `npm test`      | Runs all unit tests                        |
| `npm eject`     | Ejects the React scripts (not recommended) |


# API Integration

- Axios is used for HTTP requests in `src/api/customerApi.js.`

- Example usage:

```js
import { customerApi } from './api/customerApi';

// Get all customers
customerApi.list().then(res => console.log(res.data));

// Get a customer by ID
customerApi.getById("123").then(res => console.log(res.data));
```

# Testing

- Jest and React Testing Library are used for testing components and pages.
- Run all tests:
```
npm test
```

- Test files are located alongside their respective components:

```
src/components/customers/CustomerList.test.js
src/pages/AddAddressPage.test.js
```

# Components Overview

**Customers**

- **CustomerList:** Displays list of customers.

- **CustomerForm:**  Add or edit a customer.

- **CustomerDetails:**  View detailed info of a customer.

- **OnlyOneAddressToggle:** Toggle for single address mode.

**Addresses**

- **AddressForm:** Add a new address and Edit address.

- **AddressList:** View all addresses.

**Common**

**Spinner:** Loading indicator.

**Pages**

**AddAddressPage**: Page to add addresses.

**ErrorPage**: Displays errors (supports code and message).

 # Production Url

```
https://customers-frontend-lovat.vercel.app/ 

```

**Backend Repository:** 
```
https://github.com/NagulmeeraShaik7/customers-backend 

```

