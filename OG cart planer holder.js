// Function to filter products by color
function filterProductsByColor(color) {
  const productElements = document.querySelectorAll('.col-sm-6.col-lg-4.py-3');

  productElements.forEach((productElement) => {
    const productColor = productElement.getAttribute('data-color');
    const colors = JSON.parse(productColor);

    // Check if the selected color is in the product's colors array
    if (colors.some((c) => c.color_name === color)) {
      productElement.style.display = 'block'; // Show the product
    } else {
      productElement.style.display = 'none'; // Hide the product
    }
  });
}

// Example usage:
filterProductsByColor('Pink'); // Filter products by color 'Pink'




