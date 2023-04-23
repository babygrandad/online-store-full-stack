const userQuantity = document.getElementById('user-quantity')

// functions that control the incease and decrease of the
// quantity the user wants to buy
function stepUp() {
        userQuantity.value = parseInt(userQuantity.value) + 1
}
function stepDown() {
    if (userQuantity.value > 1) {
        userQuantity.value = parseInt(userQuantity.value) - 1
    }
}