
//---- Jquery code ---- \\

// code to control the increase and decrease of quanty 
$(document).ready(function() {
    const userQuantity = $('#user-quantity');

    // Function to increase the quantity
    function stepUp() {
        if (userQuantity.val() < 5) {
            userQuantity.val(parseInt(userQuantity.val()) + 1);
        }
    }

    // Function to decrease the quantity
    function stepDown() {
        if (userQuantity.val() > 1) {
            userQuantity.val(parseInt(userQuantity.val()) - 1);
        }
    }

    // Event listeners for increase and decrease buttons
    $('#quantity-Plus').on('click', stepUp);
    $('#quantity-Minus').on('click', stepDown);

    // Event listener for input constraint
    userQuantity.on('keyup', function() {
        if (userQuantity.val() > 5) {
            userQuantity.val(5);
        }
        if (userQuantity.val() < 1) {
            userQuantity.val(1);
        }
    });
});
  

// code to change the colors on the shop page.
$('.image-color-changer').on('click', function(){
    var newImage = $(this).data('image');
    var card = $(this).closest('.item-wrapper');
    var cardImage = card.find('.item-image');
    cardImage.attr('src', newImage);
    console.log(newImage)
});