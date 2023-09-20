// client side authentication script for Login page
$(document).ready(function () {
  const sizeField = $('select[name="size"]');
  const colorField = $('select[name="color"]');
  const userQuantiy = $('#user-quantity');
  const successDiv = $('#success-alert');
  const failDiv = $('#fail-alert');

  sizeField.on('change', function (e) {
    checkNoValue(sizeField, e);
  });

  colorField.on('change', function (e) {
    checkNoValue(colorField, e);
  });

  $("#purchase-form").submit(function (e) {

    if (checkNoValue(colorField, e) == true && checkNoValue(sizeField, e) == true) {
      const formData = $(this).serializeArray();

      //convert formdata from serializedArry to object
      const formDataObject = {};
      formData.forEach(item => {
        formDataObject[item.name] = item.value;
      });
      //convert Quantity from string to interger
      formDataObject.quantity = parseInt(formDataObject.quantity);
      //add unique timestap to identify when the entry was made. Add it to the formdata object
      formDataObject.entryID = new Date().getTime();;
      console.log(formDataObject)

      axios.post("/cart/add", formDataObject)
        .then(response => {
          location.reload(),

          successDiv.removeClass('d-none');
          setTimeout(() => {
            successDiv.addClass('d-none');
          }, 3000);
        })
        .catch(error => {

          if (error.request) {
            const resError = (error + "! Please try again.")
            console.log(resError);
            failDiv.removeClass('d-none').text(resError);
            setTimeout(() => {
              failDiv.addClass('d-none');
            }, 4000);
          }
          // Failure block, show error message (status codes 401, 500)
          else if (error.response) {
            console.log("Response Data:" + error.response.data);
            console.log("Status Code:" + error.response.status);
            console.log("Status Text:" + error.response.statusText);
            console.log("Headers:" + error.response.headers);
          } else {
            failDiv.removeClass('d-none').text("Error Message:" + error.message);
            console.log("Error Message:" + error.message);
          }
        });

    }
    e.preventDefault();
  });
});

function checkNoValue(inputField, e) {
  if (!inputField.val()) {
    $(inputField).addClass('is-invalid');
    e.preventDefault();
    return false
  } else {
    $(inputField).removeClass('is-invalid');
    return true
  }
}
