//client side authentication script for Login page
$("#loginForm").submit(function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get form fields
    const emailField = $('input[name="email"]');
    const passwordField = $('input[name="password"]');
  
    // Get form data values.
    const formData = {
        email: emailField.val(),
        password: passwordField.val()
    }
    // Send form data to Server and await response
    axios.post("/login", formData)
      .then(response => {
        window.location.href = '/products'
      })
      .catch(error => {
        // Failure block, show error message (status codes 401, 500)
        if (error.response) {
          $('#validationStatus').removeClass('d-none').text(error.response.data.message);
          // Handle the UI to show the error message to the user.
          passwordField.val('')
        }
      });
  }
);
  

function incorectDetails(inputField){
    inputField.addClass('is-invalid')
}

function checkNoValue(inputField, e) {
    if (!inputField.val()) {
        $(inputField).addClass('is-invalid');
        e.preventDefault();
    } else {
        $(inputField).addClass('is-valid').removeClass('is-invalid');
        return;
    }
};