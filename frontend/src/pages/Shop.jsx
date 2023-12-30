import React, { useState, useEffect } from "react";
import "./Shop.css"; // Ensure the CSS file path is correct

const Shop = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const handleAddToCart = (productId) => {
    // PUT request to server to update Cart status of the product
    fetch(`http://localhost:3001/api/add-to-cart/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Cart: true }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        // Assuming your API returns the updated product, you could update state here
        setProducts(
          products.map((product) =>
            product.id === productId ? { ...product, Cart: true } : product
          )
        );
      })
      .catch((error) => console.error("Error adding item to cart:", error));

    setShowNotification(true);

    // Hide the notification after a brief delay
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = filteredProducts.slice(firstItemIndex, lastItemIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setCurrentPage(1); // Reset to the first page on filter change
    let updatedProducts = [...products];

    if (value === "priceLowHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (value === "priceHighLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (value !== "all") {
      updatedProducts = updatedProducts.filter(
        (product) => product.type === value
      );
    }

    setFilteredProducts(updatedProducts);
  };

  return (
    <div className="shop-container" id="shop">
      {showNotification && (
        <div className="notification">Item added to cart!</div>
      )}

      <h1>Shop Great Deals!</h1>
      <div className="filter-container">
        <label htmlFor="filter">Filter by: </label>
        <select id="filter" onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="priceLowHigh">Price, low to high</option>
          <option value="priceHighLow">Price, high to low</option>
          <option value="Shirts">Shirts</option>
          <option value="Hoodies/Coats">Hoodies/Coats</option>
          <option value="Pants">Pants</option>
        </select>
      </div>
      <div className="products-grid">
        {currentItems.map((product) => (
          <div key={product.id} className="product-item">
            <img
              src={`http://localhost:3001/images/${product.image}`}
              alt={product.name}
            />
            <h3>{product.name}</h3>
            <p className="price">${product.price.toFixed(2)}</p>
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(product.id)}
            >
              Add to Cart
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
            onClick={() => paginate(number)}
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
