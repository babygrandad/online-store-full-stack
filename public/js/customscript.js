const userQuantity = document.getElementById('user-quantity')

// functions that control the incease and decrease of the
// quantity the user wants to buy
function stepUp() {
        userQuantity.value = parseInt(userQuantity.value) + 1
}
function stepDown() {
    if (userQuantity.value > 1) {
        userQuantity.value = parseInt(userQuantity.value) - 1
    }
}


$('.card .color-option').on('click', function() {
    var color = $(this).data('color');
    var productId = $(this).closest('.card').data('product-id');
    var imagePath = `/assets/images/shoes/${productId} - ${color}.png`;
    $(this).closest('.card').find('.item-image').attr('src', imagePath);
  });
  
  
  
  