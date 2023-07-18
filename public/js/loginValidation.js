//client side authentication script for Login page
$("#loginForm").submit(function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get form fields
    const emailField =  $('input[name="email"]');
    const passwordField = $('input[name="password"]');
    
    // Get form data values.
    const formData = $(this).serialize();

    //Send form data to Server and await response
    axios.post("/login", formData)
    .then(response => {
        //Success block, redirect to desired page
        window.location.href = '/contact';
    })
    .catch(error => {
        //Failure block keep on the login page
        if (error.response) {
        $('#validationStatus').removeClass('d-none').text(error.response.data)
        passwordField.val('')
        }
    });
  
});

function incorectDetails(inputField){
    inputField.addClass('is-invalid')
}