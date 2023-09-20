
//client side authentication script for register page
$('#signupForm').on('submit', function(e){

    //Checck firs tname validity.
    const fName = $('input[name="fname"]');
    checkNoValue(fName, e);

    //Checck last name validity.
    const lName = $('input[name="lname"]');
    checkNoValue(lName, e);

    //Checck Phone validity.
    const phone = $('input[name="phone"]');
    checkPhoneValue(phone, e);

    //Checck Email validity.
    const email = $('input[name="email"]');
    checkEmailValue(email, e);

    //Checck Password validity.
    const password = $('input[name="password"]');
    checkNoValue(password, e);

    //this is to stop form submission while testing
    //e.preventDefault();
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
    var value = inputField.val().trim();

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
