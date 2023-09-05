if (req.isAuthenticated()) {
    // user is authenticated and thers a cart on the browser
    if (req.cookies.cart) {
        
    }
    // user is authenticated but there is no cart on the browser
    else {
        
    }
}
else {
    // user is NOT authenticated and thers a cart on the browser
    if (req.cookies.cart) {
        let cart = req.cookies.cart;
        let userID = cart.userID;

        if(userID.startsWith("Guest :")){
            cart.updated = new Date().getTime();

            updateGuestCartInDB(req, res, cart, connection);
        }
    }
    // user is NOT authenticated and there is no cart on the browser
    else {
        let cart = newCartForGuest(); // initialize and populate the cart
        
        newCartToDB(req, res, cart, connection) // add the cart to the database
    }
}



// all functions below this point




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

        function determineUser() {
            if (userID.startsWith("Guest :")) {
                return "Guest User";
            } else {
                return userID;
            }
        }

        // Handle response here
        res
            .cookie("cart", cart, { maxAge: 3600000 })
            .status(200)
            .send(`Cart saved for ${determineUser()}.`);
    } catch (error) {
        // Handle any error
        console.error(error);
        res.status(500).send("Error saving cart. Please try again");
    }
}