
//---- Jquery code ---- \\

// code to control the increase and decrease of quanty 
$(document).ready(function () {

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
    const userQuantity = $('#user-quantity');
    userQuantity.on('keyup', function () {
        if (userQuantity.val() > 5) {
            userQuantity.val(5);
        }
        if (userQuantity.val() < 1) {
            userQuantity.val(1);
        }
    });

    const cartCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('cart='));
    if (cartCookie) {
        // Retrieve the cart information from the "cart" cookie
        const cookies = document.cookie
            .split(';')
            .map(cookie => cookie.split('='))
            .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {});

        const cookieValue = cookies.cart.substring(2);
        const decodedCartValue = decodeURIComponent(cookieValue);
        const cartData = JSON.parse(decodedCartValue);
        $('#cartCount').text(cartData.sumQuantity || '0')
    } else {
        $('#cartCount').text('0')
    }

    $('.logout-link').on('click', function (event) {
        event.preventDefault(); // Prevent the default behavior of navigating to a new page

        axios.post('/logout')
      .then(function (response) {
        if (response) {
            
          window.location.href = response.request.responseURL;
        }
      })
      .catch(function (error) {
        console.error('Logout error:', error);
      });
    });


    $('#newsletter').on('submit', function (event){
        event.preventDefault()

        $(this).find('input').val('');

        alert('We will be in touch.')
    })

    $('#contact-form').on('submit', function (event){
        event.preventDefault()

        $(this).find('input').val('');
        $(this).find('textarea').val('');

        alert('Thanks for reaching out')
    })
});


// code to change the colors on the shop page.
$('.image-color-changer').on('click', function () {
    var newImage = $(this).data('image');
    var card = $(this).closest('.item-wrapper');
    var cardImage = card.find('.item-image');
    cardImage.attr('src', newImage);
});

$('.available-options-wrapper li').click(function () {
    // Get the selected color and number from the data attributes
    const selectedColor = $(this).data('color');
    const selectedNumber = $(this).data('number');

    // Construct the new image source based on the selected color and number
    const imageSrc = `/assets/images/shoes/${selectedNumber} - ${selectedColor}.png`;

    // Get a reference to the image element and update the source
    const imageElement = $('.big-product-image');
    imageElement.attr('src', imageSrc);
});