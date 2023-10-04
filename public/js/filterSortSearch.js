$(document).ready(function () {

  


});

// Function to show all products
function clearAllFilters() {
  $('.shoe-component').show(); // Show all products
}

// Function to filter products by color
function filterProductsByColor(color) {
  $('.shoe-component').each(function () {
    const groupColors = $(this).data('group-colors');

    // Check if the selected color is in the product's colors array
    if (groupColors.includes(color)) {
      $(this).show(); // Show the product
    } else if (color === "all") {
      $('.shoe-component').show(); // Show all products
    } else {
      $(this).hide(); // Hide the product
    }
  });
}

// Function to filter products by gender
function filterProductsByGender(gender) {
  $('.shoe-component').each(function () {
    const genders = $(this).data('gender');

    // Check if the selected gender is in the product's genders array
    if ((genders.includes('Male') && genders.includes('Female'))) {
      $(this).show();
    } else if (genders.includes(gender)) {
      $(this).show(); // Show the product
    } else if (gender === 'All') {
      $('.shoe-component').show(); // Show all products
    } else {
      $(this).hide(); // Hide the product
    }
  });
}

// Function to sort products by price
function SortProductsByPrice(sortValue) {
  const $prices = $('.shoe-component');

  // Create an array to store the original order of elements
  const originalOrder = $prices.toArray();

  $prices.detach().sort(function (a, b) {
    const priceA = parseFloat($(a).data('price'));
    const priceB = parseFloat($(b).data('price'));

    if (sortValue === 'high') {
      return priceB - priceA; // Sort high to low
    } else if (sortValue === 'low') {
      return priceA - priceB; // Sort low to high
    } else {
      // Sort by the original order when "None" is selected
      return originalOrder.indexOf(a) - originalOrder.indexOf(b);
    }
  }).appendTo('.shoe-component-container');
}
// Event listener for radio buttons
$("input[name='sortingOptions']").change(function () {
  const selectedSortOption = $("input[name='sortingOptions']:checked").val();
  SortProductsByPrice(selectedSortOption);
});




