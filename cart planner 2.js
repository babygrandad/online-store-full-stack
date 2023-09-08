//LOGGING-IN LOGIC
function cartLogicFirst() {
    if (req.cookies.cart) {// Is there a local cart - Yes
        let cart = req.cookies.cart

        if (cart.userID.startsWith("Guest :")) { // does the userID start with Guest? - Yes

            const cartResults = checkIfCartExistsInDB(res, connection, user);
            console.log("What if statement sees if thers is a match: ", cartResults)
            if (cartResults.length === 1) { //does the user have a cart in the DB? - Yes

                loginFoundMatchingCart(res, cart, connection, cartResults)
            }
            else { //does the user have a cart in the DB? - No
                let cart = newCartForAuthUser();
                newEmptyCartToDB(res, cart, connection);
            }

        }
        else { // does the userID start with Guest? - No

            let cart = newCartForAuthUser()

            newEmptyCartToDB(res, cart, connection)
        }

    } else {// Is there a local cart - no

        let cart = null;

        const cartResults = checkIfCartExistsInDB(res, connection, user);
        console.log("What if statement sees if thers no match: ", cartResults)
        if (cartResults.length === 1) { //does the user have a cart in the DB? - Yes

            cart.userID = cartResults[0].user_id;
            cart.cartID = cartResults[0].cart_id;
            cart.created = cartResults[0].created;
            cart.updated = cartResults[0].updated;

            //testing cart results
            console.log(cart);

            res
                .cookie("cart", cart, { maxAge: 3600000 })
                .status(200)
                .send(`Login Successful`);
        }
        else { //does the user have a cart in the DB? - No
            let cart = newCartForAuthUser();
            newEmptyCartToDB(res, cart, connection);
        }
    }

    function newCartForAuthUser() {
        let timestamp = new Date().getTime();
        let cart = {};
        cart.cartID = uuidv4();
        cart.userID = req.user.email;
        cart.created = timestamp;
        cart.updated = timestamp;
        return cart;
    }
    async function newEmptyCartToDB(res, cart, connection) {
        try {
            const { cartID, userID, created, updated } = cart;

            // SQL query 1 (using promise-based API)
            const insertCartQuery = "INSERT INTO carts (cart_id, user_id, created, modified) VALUES (?,?,?,?)";
            const insertCartValues = [cartID, userID, created, updated];
            const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);
            //testing cart results
            console.log(cart);

            // Handle response here
            res
                .cookie("cart", cart, { maxAge: 3600000 })
                .status(200)
                .send(`Login Successful`);
        } catch (error) {
            // Handle any error
            console.error(error);
            res.status(500).send("Error saving cart. Please try again.");
        }
    }
    async function checkIfCartExistsInDB(res, connection, user) {
        try {
            // SQL query 1 (using promise-based API) - check to see if there's a matching
            // username cart as the logged-in user.
            const checkCartQuery = "SELECT * FROM carts WHERE user_id = ?";
            const [cartResults] = await connection.promise().query(checkCartQuery, [user.email]);

            //testing cart results
            console.log('cart results -: ' + [cartResults]);
            return cartResults;

        }
        catch (error) {
            console.error(error);
            res.status(500).send("Error finding cart");
        }
    }
    async function loginFoundMatchingCart(res, cart, connection, cartResults) {
        const { cart_id, user_id } = cartResults[0];
        const { cartID } = cart
        const newUpdate = new Date().getTime();

        // SQL query 2 (using promise-based API) - update cart_items with the matched cart_id
        const updateCartItemsQuery = "UPDATE cart_items SET cart_id = ? WHERE cart_id = ?";
        const updateCartItemsValues = [cart_id, cartID];
        const [updateResults] = await connection.promise().query(updateCartItemsQuery, updateCartItemsValues);

        // SQL query 3 (using promise-based API) - update the modified timestamp in carts
        const updateCartQuery = "UPDATE carts SET modified = ? WHERE user_id = ?";
        const updateCartValues = [newUpdate, user_id];
        const [updateCartResults] = await connection.promise().query(updateCartQuery, updateCartValues);

        // Update the cart object with the results and set a cookie
        cart.userID = user_id;
        cart.cartID = cart_id;
        cart.created = cartResults[0].created;
        cart.updated = newUpdate;

        //testing cart results
        console.log(cart);

        res
            .cookie("cart", cart, { maxAge: 3600000 })
            .status(200)
            .send(`Login Successful`);
    }
}


//LOGGING-IN LOGIC RE-REVISED
function cartLogicSecond() {
    if (req.cookies.cart) {// Is there a local cart - Yes
        let cart = req.cookies.cart
        console.log('this user has  local cart')
        if (cart.userID.startsWith("Guest :")) { // does the userID start with Guest? - Yes
            console.log('this users cart starts with "Guest"')
            // check to see if theres a db cart (condition check is in this function)
            checkIfCartExistsInDBAlso(res, cart, connection, user);
        }
        else { // does the userID start with Guest? - No
            console.log('this users cart does not start with guest so im deleting it and creating a new one')
            let cart = newCartForAuthUser(user)
            newEmptyCartToDB(res, cart, connection)
        }

    } else {// Is there a local cart - no
        console.log('This user does not have a local cart')
        checkIfCartExistsInDB(res, connection, user)
    }

    function newCartForAuthUser(user) {
        console.log('Im creating a new cart for the authenticated user.')
        let timestamp = new Date().getTime();
        let cart = {};
        cart.cartID = uuidv4();
        cart.userID = user.email;
        cart.created = timestamp;
        cart.updated = timestamp;
        return cart;
    }
    async function newEmptyCartToDB(res, cart, connection) {
        try {
            const { cartID, userID, created, updated } = cart;

            console.log('I\'m submitting a new empty cart to the DB ')

            // SQL query 1 (using promise-based API)
            const insertCartQuery = "INSERT INTO carts (cart_id, user_id, created, modified) VALUES (?,?,?,?)";
            const insertCartValues = [cartID, userID, created, updated];
            const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);
            //testing cart results
            console.log(cart);

            // Handle response here
            res
                .cookie("cart", cart, { maxAge: 3600000 })
                .status(200)
                .send(`Login Successful`);
        } catch (error) {
            // Handle any error
            console.error(error);
            res.status(500).send("Error saving cart. Please try again.");
        }
    }
    async function checkIfCartExistsInDBAlso(res, cart, connection, user) {
        try {
            // SQL query 1 (using promise-based API) - check to see if there's a matching
            // username cart as the logged-in user.
            const checkCartQuery = "SELECT * FROM carts WHERE user_id = ?";
            const [cartResults] = await connection.promise().query(checkCartQuery, [user.email]);
            console.log('I just checked if theres a cart for this user and...')

            //testing cart results
            console.log('cart results -: length = ' + cartResults.length);

            if (cartResults.length === 1) { //does the user have a cart in the DB? - Yes
                console.log('This user has a cart in the DB')
                loginFoundMatchingCart(res, cart, connection, cartResults)
            } else { //does the user have a cart in the DB? - No
                console.log('This user does NOT! have a cart in the db')
                loginDidNotFoundMatchingCart(res, cart, connection, user)
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Error finding cart");
        }
    }
    async function checkIfCartExistsInDB(res, connection, user) {
        try {
            // SQL query 1 (using promise-based API) - check to see if there's a matching
            // username cart as the logged-in user.
            const checkCartQuery = "SELECT * FROM carts WHERE user_id = ?";
            const [cartResults] = await connection.promise().query(checkCartQuery, [user.email]);
            console.log('I just checked if theres a cart for this user and...')

            //testing cart results
            console.log('cart results -: length = ' + cartResults.length);

            if (cartResults.length === 1) { //does the user have a cart in the DB? - Yes
                console.log('This user has a cart in the DB')
                loginFoundExistingCart(res, cartResults)
            } else { //does the user have a cart in the DB? - No
                let cart = newCartForAuthUser();
                newEmptyCartToDB(res, cart, connection)
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Error finding cart");
        }
    }
    async function loginFoundMatchingCart(res, cart, connection, cartResults) {
        const { cart_id, user_id } = cartResults[0];
        const { cartID } = cart
        const newUpdate = new Date().getTime();

        console.log('Now im updating the cart items')
        // SQL query 2 (using promise-based API) - update cart_items with the matched cart_id
        const updateCartItemsQuery = "UPDATE cart_items SET cart_id = ? WHERE cart_id = ?";
        const updateCartItemsValues = [cart_id, cartID];
        const [updateResults] = await connection.promise().query(updateCartItemsQuery, updateCartItemsValues);

        console.log('now Im updating the cart')
        // SQL query 3 (using promise-based API) - update the modified timestamp in carts
        const updateCartQuery = "UPDATE carts SET modified = ? WHERE user_id = ?";
        const updateCartValues = [newUpdate, user_id];
        const [updateCartResults] = await connection.promise().query(updateCartQuery, updateCartValues);

        console.log('now Im deleting the guest cart')
        // SQL query 4 (using promise-based API) - update the modified timestamp in carts
        const deleteCartQuery = "Delete FROM carts WHERE cart_id = ?";
        const deleteCartValues = [cartID];
        const [deleteCartResults] = await connection.promise().query(deleteCartQuery, deleteCartValues);

        // Update the cart object with the results and set a cookie
        cart.userID = user_id;
        cart.cartID = cart_id;
        cart.created = cartResults[0].created;
        cart.updated = newUpdate;

        //testing cart results
        console.log(cart);

        res
            .cookie("cart", cart, { maxAge: 3600000 })
            .status(200)
            .send(`Login Successful`);
    }
    async function loginDidNotFoundMatchingCart(res, cart, connection, user) {
        const { cartID, created } = cart

        const newUpdate = new Date().getTime();

        console.log('now Im updating the cart\'s user_id')
        // SQL query 3 (using promise-based API) - update the modified timestamp in carts
        const updateCartQuery = "UPDATE carts SET user_id = ?, modified = ? WHERE cart_id = ?";
        const updateCartValues = [user.email, newUpdate, cartID];
        const [updateCartResults] = await connection.promise().query(updateCartQuery, updateCartValues);

        // Update the cart object with the results and set a cookie
        cart.userID = user.email;
        cart.cartID = cartID;
        cart.created = created;
        cart.updated = newUpdate;

        //testing cart results
        console.log(cart);

        res
            .cookie("cart", cart, { maxAge: 3600000 })
            .status(200)
            .send(`Login Successful`);
    }
    async function loginFoundExistingCart(res, cartResults) {
        const { cart_id, user_id, created, modified } = cartResults[0];

        console.log('Now im creating a cookie with this users exiting DB cart')
        // Update the cart object with the results and set a cookie
        let cart = {}
        cart.userID = user_id;
        cart.cartID = cart_id;
        cart.created = created;
        cart.updated = modified;

        //testing cart results
        console.log(cart);

        res
            .cookie("cart", cart, { maxAge: 3600000 })
            .status(200)
            .send(`Login Successful`);
    }
}











//-------------------------------------------------------------------------------

//LOGGED IN AND LOGGED OUT LOGIC
if (req.isAuthenticated()) { //Is the user logged in? - Yes

    // There is a cart already so.
    let cart = req.cookies.cart;
    updateAuthCartInDB(req, res, cart, connection)

} else { // is the user logged in? - No

    if (req.cookies.cart) { // is there a cart in the browser? - Yes
        let cart = req.cookies.cart;
        let userID = cart.userID;

        if (userID.startsWith("Guest :")) { // is it a guest cart? - Yes

            cart.updated = new Date().getTime();
            updateGuestCartInDB(req, res, cart, connection);
        } else {// is it guest cart? - no

            let cart = newCartForGuest();
            newCartToDB(req, res, cart, connection)
        }
    } else { // is there a cart in the browser? - No

        let cart = newCartForGuest();
        newCartToDB(req, res, cart, connection)
    }
}

function newCartForGuest() {
    let timestamp = new Date().getTime();
    let cart = {};
    cart.cartID = uuidv4();
    cart.userID = "Guest : " + uuidv4();
    cart.created = timestamp;
    cart.updated = timestamp;
    return cart;
}
async function newCartToDB(req, res, cart, connection) {
    try {
        const { cartID, userID, created, updated } = cart;

        // SQL query 1 (using promise-based API)
        const insertCartQuery = "INSERT INTO carts (cart_id, user_id, created, modified) VALUES (?,?,?,?)";
        const insertCartValues = [cartID, userID, created, updated];
        const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);

        // SQL query 2 (using promise-based API)
        const { color, size, quantity, productID, entryID } = req.body;
        const insertItemsQuery = "INSERT INTO cart_items (cart_id, entry_id, product_id, color, size, quantity) VALUES (?,?,?,?,?,?)";
        const insertItemsValues = [cartID, entryID, productID, color, size, quantity];
        const [itemsResults] = await connection.promise().query(insertItemsQuery, insertItemsValues);

        function determineUser() {
            if (userID.startsWith("Guest :")) {
                return "Guest User";
            } else {
                return userID;
            }
        }

        //testing cart results
        console.log(cart);

        // Handle response here
        res
            .cookie("cart", cart, { maxAge: 3600000 })
            .status(200)
            .send(`Cart saved for ${determineUser()}.`);
    } catch (error) {
        // Handle any error
        console.error(error);
        res.status(500).send("Error saving cart. Please try again.");
    }
}
async function updateGuestCartInDB(req, res, cart, connection) {
    try {
        const { userID, cartID, updated } = cart;

        // SQL query 1 (using promise-based API)
        const insertCartQuery = "UPDATE carts SET modified = ? WHERE cart_id = ?";
        const insertCartValues = [updated, cartID];
        const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);


        // SQL query 2 (using promise-based API)
        const { color, size, quantity, productID, entryID } = req.body;
        const insertItemsQuery = "INSERT INTO cart_items (cart_id, entry_id, product_id, color, size, quantity) VALUES (?,?,?,?,?,?)";
        const insertItemsValues = [cartID, entryID, productID, color, size, quantity];
        const [itemsResults] = await connection.promise().query(insertItemsQuery, insertItemsValues);

        //testing cart results
        console.log(cart);

        // Handle response here
        res
            .cookie("cart", cart, { maxAge: 3600000 })
            .status(200)
            .send(`Cart saved for Guest.`);
    } catch (error) {
        // Handle any error
        console.error(error);
        res.status(500).send("Error saving cart. Please try again");
    }
}
async function updateAuthCartInDB(req, res, cart, connection) {
    try {
        const { userID, cartID, updated } = cart;

        // SQL query 1 (using promise-based API)
        const insertCartQuery = "UPDATE carts SET modified = ? WHERE cart_id = ?";
        const insertCartValues = [updated, cartID];
        const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);

        // SQL query 2 (using promise-based API)
        const { color, size, quantity, productID, entryID } = req.body;
        const insertItemsQuery = "INSERT INTO cart_items (cart_id, entry_id, product_id, color, size, quantity) VALUES (?,?,?,?,?,?)";
        const insertItemsValues = [cartID, entryID, productID, color, size, quantity];
        const [itemsResults] = await connection.promise().query(insertItemsQuery, insertItemsValues);

        //testing cart results
        console.log(cart);

        // Handle response here
        res
            .cookie("cart", cart, { maxAge: 3600000 })
            .status(200)
            .send(`Cart saved for ${userID}.`);
    } catch (error) {
        // Handle any error
        console.error(error);
        res.status(500).send("Error saving cart. Please try again");
    }
}