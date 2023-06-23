const userQuantity = document.getElementById('user-quantity');
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

//---- Jquery code from here on out. ---- \\

// code to change the colors on the shop page.
$('.image-color-changer').on('click', function(){
    var newImage = $(this).data('image');
    var card = $(this).closest('.item-wrapper');
    var cardImage = card.find('.item-image');
    cardImage.attr('src', newImage);
    console.log(newImage)
});