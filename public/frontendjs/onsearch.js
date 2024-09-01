const priceFilter = document.getElementById('price-filter');
  const priceRangeSpan = document.getElementById('price-range');
  const priceMinSpan = document.getElementById('price-min');
  const priceMaxSpan = document.getElementById('price-max');
  const filterButton = document.getElementById('filter-button');

  // Function to update price range display
  function updatePriceRangeDisplay() {
    const currentPrice = priceFilter.value;
    priceMinSpan.textContent = currentPrice;
    priceMaxSpan.textContent = 1000; // Assuming maximum price is 1000, adjust as needed
  }

  // Event listener for price filter changes
  priceFilter.addEventListener('input', () => {
    updatePriceRangeDisplay();
  });

  // Function to filter products (replace with your actual product data logic)
  function filterProducts() {
    // Implement your logic here to filter products based on selected filters (price, color, brand, rating, discount)
    // You'll need access to your product data and DOM manipulation techniques to update the product list
    console.log('Filtering products...'); // Placeholder for now
  }

  // Event listener for filter button click
  filterButton.addEventListener('click', () => {
    filterProducts();
  });

  // Responsive behavior for filter panel on smaller screens (up to 768px wide)
  const mediaQueryList = window.matchMedia('(max-width: 768px)');

  const handleResize = () => {
    const filterPanel = document.querySelector('.filter-panel');
    if (mediaQueryList.matches) {
      // Collapse filter panel on smaller screens
      filterPanel.classList.add('collapsed');
    } else {
      // Expand filter panel on larger screens
      filterPanel.classList.remove('collapsed');
    }
  };

  mediaQueryList.addEventListener('change', handleResize);
  handleResize(); // Call initially to handle initial screen size
