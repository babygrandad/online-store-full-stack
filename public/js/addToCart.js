 // client side authentication script for Login page



$(document).ready(function() {
    const sizeField = $('select[name="size"]');
    const colorField = $('select[name="color"]');

    sizeField.on('change', function(e) {
        checkNoValue(sizeField, e);
    });
    
    colorField.on('change', function(e) {
        checkNoValue(colorField, e);
    });
    
    $("#purchase-form").submit(function(e) {

      if(checkNoValue(colorField, e) == true && checkNoValue(sizeField, e) == true){
      const formData = $(this).serializeArray()
      console.log(JSON.stringify(formData))
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
