 // client side authentication script for Login page
$(document).ready(function() {
    const sizeField = $('select[name="size"]');
    const colorField = $('select[name="color"]');
    const userQuantiy = $('#user-quantity');
    const successDiv = $('#success-alert');
    const failDiv = $('#fail-alert');

    sizeField.on('change', function(e) {
        checkNoValue(sizeField, e);
    });
    
    colorField.on('change', function(e) {
        checkNoValue(colorField, e);
    });
    
    $("#purchase-form").submit(function(e) {

      if(checkNoValue(colorField, e) == true && checkNoValue(sizeField, e) == true){
      const formData = $(this).serializeArray();
      var date = new Date().getTime();
      formData.push({entryID : date})
      console.log(formData)

      axios.post("/cart/add", formData)
      .then(response => {
        colorField.val(colorField.find("option:first").val());
            sizeField.val(sizeField.find("option:first").val());
            userQuantiy.val(1);

            successDiv.removeClass('d-none');
            setTimeout(()=>{
                successDiv.addClass('d-none');
            }, 3000);
      })
      .catch(error => {
        // Failure block, show error message (status codes 401, 500)
        if (error.response) {
          // if you get an error set the failure div to appear with the error message.
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
