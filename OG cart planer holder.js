// Function to filter products by color
function filterProductsByColor(color) {
  const productElements = document.querySelectorAll('shoe-component');

  productElements.forEach((productElement) => {
    const productColor = productElement.getAttribute('data-color');
    const colors = JSON.parse(productColor);

    // Check if the selected color is in the product's colors array
    if (colors.some((c) => c.group_color === color)) {
      productElement.style.display = 'block'; // Show the product
    } else {
      productElement.style.display = 'none'; // Hide the product
    }
  });
}

// Example usage:
filterProductsByColor('Pink'); // Filter products by color 'Pink'


/*-------------------------------------------------------------------------------------------------------------*/


// Function to filter products by color
function filterProductsByColor(color) {
  const productElements = document.querySelectorAll('.shoe-component'); // Correct the selector

  productElements.forEach((productElement) => {
    const productColors = productElement.getAttribute('data-group-colors');
    const colors = JSON.parse(productColors);

    // Check if the selected color is in the product's colors array
    if (colors.includes(color)) {
      productElement.style.display = 'block'; // Show the product
    } else {
      productElement.style.display = 'none'; // Hide the product
    }
  });
}

// Example usage:
filterProductsByColor('Pink'); // Filter products by color 'Pink'
