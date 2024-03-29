var resultingArray = []

$(document).ready(function () {
  // Get references to the search input field and the shoe-component-container elements
  const searchInput = $('#shoe-search');
  const shoeComponents = $('.shoe-component');

  // Add an event listener to the form's submit event
  $('#shoe-search-form').on('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log('Form Submitted')
  });

  // Add an event listener to the input field
  searchInput.on('input', function () {
    const searchQuery = $(this).val().toLowerCase().trim();
    shoeComponents.each(function () {
      const productName = ($(this).data('product-name') || '').toLowerCase();
      // Check if the search query is empty or if the name contains the query
      if (searchQuery === '' || productName.includes(searchQuery)) {
        $(this).show(); // Show the shoe-component-container
      } else {
        $(this).hide(); // Hide the shoe-component-container
      }
    });
  });

  // Attach change event handlers to the checkboxes
  $('input[name="checkCategory"]').change(syncCheckboxes);

});


// Function to show all products
function clearAllFilters() {
  $('.shoe-component').show(); // Show all products
  
  $('input[name="checkCategory"]').prop('checked', true);
  updateResultingArray();
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
  const prices = $('.shoe-component');

  // Create an array to store the original order of elements
  const originalOrder = prices.toArray();

  prices.detach().sort(function (a, b) {
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
// Event listener for price radio buttons
$("input[name='sortingOptions']").change(function () {
  const selectedSortOption = $("input[name='sortingOptions']:checked").val();
  SortProductsByPrice(selectedSortOption);
});

// Function to syncronise checkboxes on big and small screen
function syncCheckboxes() {
  var clickedValue = $(this).val();
  $('input[name="checkCategory"][value="' + clickedValue + '"]').prop('checked', $(this).prop('checked'));

  // Update the resulting array
  updateResultingArray();

  // Call the function to filter products by category
  filterProductsByCategory();
}

// Function to update the resulting array
function updateResultingArray() {
  var selectedCheckboxes = $('input[name="checkCategory"]:checked');
  resultingArray = selectedCheckboxes.map(function () {
    return $(this).val();
  }).get();

  // Display the resulting array (you can customize this part)
  console.log(resultingArray);
}

// Function to filter products by category
function filterProductsByCategory() {
  $('.shoe-component').each(function () {
    const categories = $(this).data('category');

    // Check if at least one of the selected categories is in the product's category array
    if (categories.some(category => resultingArray.includes(category))) {
      $(this).show(); // Show the product
    } else {
      $(this).hide(); // Hide the product
    }
  });
}


