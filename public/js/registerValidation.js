$(document).ready(function () {

    resetValidationClasses();

    const fNameField = $('input[name="fname"]');
    const lNameField = $('input[name="lname"]');
    const phoneField = $('input[name="phone"]');
    const emailField = $('input[name="email"]');
    const passwordField = $('input[name="password"]');

    $('#signupForm').on('submit', function (e) {

        // Check first name validity and store the value
        checkNoValue(fNameField, e);

        // Check last name validity and store the value
        checkNoValue(lNameField, e);

        // Check Phone validity and store the value
        checkPhoneValue(phoneField, e);

        // Check Email validity and store the value
        checkEmailValue(emailField, e);

        // Check Password validity and store the value
        checkNoValue(passwordField, e);
    });

    // Function to reset validation classes
    function resetValidationClasses() {
        $('input').removeClass('is-valid is-invalid');
    }

    const urlParams = new URLSearchParams(window.location.search);
    let message = urlParams.get('message');

    const alertMessage = $('#alertMessage');

    if (message) {
        alertMessage.text(message);
        alertMessage.show(); // Show the alert
    }

    const errorAlert = $('#error-alert');
    const statusCode = errorAlert.data('status');
    console.log(statusCode);

    if (statusCode == 409) {
        emailField.addClass('is-invalid').removeClass('is-valid');
    }


});


function checkNoValue(inputField, e) {
    if (!inputField.val().trim()) {
        $(inputField).addClass('is-invalid');
        e.preventDefault();
    } else {
        $(inputField).addClass('is-valid').removeClass('is-invalid');
    }
};

function checkPhoneValue(inputField, e) {
    var value = inputField.val().replace(/\s/g, "");

    if (!/^0\d{9}$/.test(value)) {
        inputField.addClass('is-invalid');
        e.preventDefault();
    } else {
        inputField.addClass('is-valid').removeClass('is-invalid');
    }
}

function checkEmailValue(inputField, e) {
    var value = inputField.val().trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
        inputField.addClass('is-invalid');
        e.preventDefault();
    } else {
        inputField.addClass('is-valid').removeClass('is-invalid');
    }
}
