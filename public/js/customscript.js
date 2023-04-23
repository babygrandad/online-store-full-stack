const userQuantity = document.getElementById('user-quantity')
function stepUp() {
        userQuantity.value = parseInt(userQuantity.value) + 1
}
function stepDown() {
    if (userQuantity.value > 1) {
        userQuantity.value = parseInt(userQuantity.value) - 1
    }
}