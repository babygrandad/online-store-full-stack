// Assuming you are using jQuery for simplicity
$(document).ready(function () {
    // Remove product button click event
    $('.remove-product').click(function (e) {
        e.preventDefault();
        var productId = $(this).data('product-id');
        var entryId = $(this).data('entry-id');
        
        // Create an object with the data to send
        var data = {
            productId: productId,
            entryId: entryId
        };

        axios.patch('/cart/remove', data)
        .then(function (response) {
            location.reload();
        })
        .catch(function (error) {
            alert('Error deleting item. Please try again.')
            console.error(error);
        });
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
            })
            .catch(function (error) {
                alert('Error updating cart. Please try again.')
                console.error(error);
            });
    });
});
