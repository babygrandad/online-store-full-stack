// Assuming you are using jQuery for simplicity
$(document).ready(function () {
    // Remove product button click event
    $('.remove-product').click(function (e) {
        e.preventDefault();
        var productId = $(this).data('product-id');
        var entryId = $(this).data('entry-id');
        
        // You can now use productId and entryId to identify and handle the product removal.
        // For example, you can send an AJAX request to remove it from the cart.
    });

    // Quantity input change event
    $('.update-quantity').change(function () {
        var productId = $(this).data('product-id');
        var entryId = $(this).data('entry-id');
        var newQuantity = $(this).val();
    
        // Create an object with the data to send
        var data = {
            newQuantity: newQuantity,
            productId: productId,
            entryId: entryId
        };
    
        // Send an Axios POST request to update the quantity
        axios.patch('/cart/update', data)
            .then(function (response) {
                location.reload();
                // You may not need to do anything here if you redirect to the cart page.
            })
            .catch(function (error) {
                // Handle errors (e.g., display an error message to the user)
                console.error(error);
            });
    });
});
