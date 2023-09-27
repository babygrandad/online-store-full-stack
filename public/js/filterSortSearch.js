$(document).ready(function () {

    let counter = 1;



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
        } else {
            $(this).hide(); // Hide the product
        }
    });
}

