// Assuming you have the Axios and jQuery libraries included in your project

// Assuming you have a login form with id "login-form"

$("#loginForm").submit(function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get form field values
    const emailField =  $('input[name="email"]');
    const passwordField = $('input[name="password"]');
    
    // Perform client-side validation
    // checkEmailValue(email, event)

    checkNoValue(passwordField, event)

    
    // If validation checks pass, send the data to the server
    const email = emailField.val();
    const password = passwordField.val();  
    const data = { email, password };

    axios.post("/login", data)
    .then(response => {
        if (response.status === 200) {
        // Login successful
        window.location.href = "/products";
        } else {
        // Handle other non-200 status codes
        alert("An error occurred during login");
        }
    })
    .catch(error => {
    if (error.response) {
        // The request was made and the server responded with an error status code
        if (error.response.status === 401) {
        console.log(error.response.status);
        console.log(error.response.data);
        incorectDetails(emailField);
        $('#validationStatus').removeClass('d-none')
        } else {
        // Other server-side error
        alert("An error occurred during login");
        }
    } else if (error.request) {
        // The request was made, but no response was received
        console.error(error.request);
        alert("No response received from the server");
    } else {
        // Something happened in setting up the request that triggered an error
        console.error(error.message);
        alert("An error occurred during login");
    }
    });
  
});
  

function checkNoValue(inputField, e) {
    if (!inputField.val()) {
        $(inputField).addClass('is-invalid');
        e.preventDefault();
    } else {
        $(inputField).removeClass('is-invalid');
    }
};

function checkEmailValue(inputField, e) {
    var value = inputField.val();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
        inputField.addClass('is-invalid');
        e.preventDefault();
    } else {
        inputField.addClass('is-valid').removeClass('is-invalid');
    }
}

function incorectDetails(inputField){
    inputField.addClass('is-invalid')
}