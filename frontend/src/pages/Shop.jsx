import React, { useState, useEffect } from "react";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(""); // New state for the notification message
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let updatedProducts = [...products];

    // Filter products by search term
    if (searchTerm) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter products by price or other filters
    if (filter === "priceLowHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (filter === "priceHighLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchTerm, filter, products]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to the first page on filter change
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleAddToCart = (productId) => {
    const token = localStorage.getItem("token");

    if (token) {
      // User is logged in, send the request to the server
      fetch(`http://localhost:5000/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          setProducts(
            products.map((product) =>
              product.id === productId ? { ...product, Cart: true } : product
            )
          );
          setNotificationMessage("Item added to cart!");
          setShowNotification(true);
        })
        .catch((error) => {
          console.error("Error adding item to cart:", error);
        });
    } else {
      // User is not logged in, show a notification
      setNotificationMessage(
        "Please log in or create an account to add items to the cart."
      );
      setShowNotification(true);
    }

    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Adjusted to 3 seconds for better visibility
  };

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = filteredProducts.slice(firstItemIndex, lastItemIndex);

  return (
    <div className="shop-container" id="shop">
      {showNotification && (
        <div className="notification">{notificationMessage}</div>
      )}
      <h1>Shop Great Deals!</h1>
      <div className="filter-search-container">
        <label htmlFor="filter">Filter by: </label>
        <select id="filter" onChange={handleFilterChange} value={filter}>
          <option value="all">All</option>
          <option value="priceLowHigh">Price, low to high</option>
          <option value="priceHighLow">Price, high to low</option>
        </select>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="products-grid">
        {currentItems.map((product) => (
          <div key={product.id} className="product-item">
            <img
              src={`${product.image_url}`} // Reference the path from the database
              alt={product.name}
            />
            <h3>{product.name}</h3>
            <p className="price">${Number(product.price).toFixed(2)}</p>
            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(product.id)}
            >
              +
            </button>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredProducts.length / itemsPerPage) },
          (_, i) => i + 1
        ).map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Shop;
