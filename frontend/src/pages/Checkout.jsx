import React from "react";
import { useLocation } from "react-router-dom";
import "./Checkout.css"; // Ensure this points to the correct location of your Checkout.css file

const Checkout = () => {
  const location = useLocation();
  // Retrieve the total price from sessionStorage as a fallback
  const totalPrice =
    location.state?.totalPrice ??
    sessionStorage.getItem("totalPrice") ??
    "0.00";

  return (
    <div className="checkout">
      <h2>Billing Details</h2>
      <form>
        <div className="form-group half-width">
          <label htmlFor="first-name">First Name *</label>
          <input type="text" id="first-name" name="first-name" required />
        </div>

        <div className="form-group half-width">
          <label htmlFor="last-name">Last Name *</label>
          <input type="text" id="last-name" name="last-name" required />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country *</label>
          <select id="country" name="country" required>
            <option value="">Select a country</option>
            <option value="usa">United States</option>
            <option value="canada">Canada</option>
            <option value="uk">United Kingdom</option>
            {/* Add more countries as needed */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="company-name">Company Name</label>
          <input type="text" id="company-name" name="company-name" />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <input type="text" id="address" name="address" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input type="tel" id="phone" name="phone" required />
        </div>

        <div className="form-group form-group-checkbox">
          <input type="checkbox" id="create-account" name="create-account" />
          <label htmlFor="create-account">Create an account?</label>
        </div>

        <div className="form-group form-group-checkbox">
          <input
            type="checkbox"
            id="ship-different-address"
            name="ship-different-address"
          />
          <label htmlFor="ship-different-address">
            Ship to a different address?
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="order-notes">Order Notes</label>
          <textarea id="order-notes" name="order-notes"></textarea>
        </div>

        {/* Order Summary Section */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-total">
            <div className="total-label">Total Price:</div>
            <div className="total-price">${totalPrice}</div>
          </div>
          <button type="submit" className="place-order">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
