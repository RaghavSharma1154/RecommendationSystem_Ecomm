


let previewContainer = document.querySelector('.products-preview');
let previewBox = previewContainer.querySelectorAll('.preview');

document.querySelectorAll('.products-container .card').forEach(product => {
  product.onclick = () => {
    previewContainer.style.display = 'flex';
    let name = product.getAttribute('data-name');
    previewBox.forEach(preview => {
      let target = preview.getAttribute('data-target');
      if (name === target) {
        preview.classList.add('active');
      }
    });
  };
});

previewBox.forEach(close => {
  close.querySelector('.fa-times').onclick = () => {
    close.classList.remove('active');
    previewContainer.style.display = 'none';
  };
});




// cart 


{/* <div class="container">
<div class="products-container">
    <% products.forEach(product=> { %>
        <div class="card" data-name="p-1">
            <div class="product-images">
                <img src="<%= product.url %>" alt="<%= product.name %>">
            </div>
            <div class="product-details">
                <h2>
                    <%= product.name %>
                </h2>
                <p>Price: $<%= product.price %>
                </p>
                <p>Platform: <%= product.platform %>
                </p>
            </div>
        </div>
        <% }); %>
</div>
</div>




<div class="products-preview">
<div class="preview" data-target="p-1">
    <% products.forEach(product=>{%>
        <div class="card2">
            <div class="product-images">
                <i class="fas fa-times"></i>
                <img src="<%= product.url %>" alt="<%= product.name %>">
            </div>
            <h2>
                <%= product.name %>
            </h2>
            <p>
                <%= product.description %>
            </p>

            <div class="price">
                <%= product.price %>
            </div>
            <div class="buttons">
                <a href="#" class="buy">buy now</a>
                <a href="#" class="cart">add to cart</a>
            </div>
        </div>
        <% }); %>
</div>
</div> */}


{/* <div class="container">
    <div class="products-container">
      <% products.forEach((product, index)=> { %>
        <div class="card" data-name="p-1" data-index="<%= index %>">
          <div class="product-images">
            <img src="<%= product.url %>" alt="<%= product.name %>">
          </div>
          <div class="product-details">
            <h2>
              <%= product.name %>
            </h2>
            <p>Price: $<%= product.price %>
            </p>
            <p>Platform: <%= product.platform %>
            </p>
          </div>
        </div>

        <!-- Popup window -->

        <div class="popup-window" data-index="<%= index %>" style="display: none;">
          <div class="popup-content">
            <span class="close-button">&times;</span>
            <!-- <i class="fa-solid fa-xmark"></i> -->
            <div class="popup-image">
              <img src="<%= products[index].url %>" alt="<%= products[index].name %>">
            </div>
            <h2>
              <%= products[index].name %>
            </h2>
            <p>
              <%= products[index].description %>
            </p>
            <p>Price: $<%= products[index].price %>
            </p>
            <p>Platform: <%= products[index].platform %>
            </p>
            <button class="add-to-cart-button">Add to Cart</button>
            <button class="buy-now-button">Buy Now</button>
          </div>
        </div>

        <% }); %>
    </div>
  </div> */}









