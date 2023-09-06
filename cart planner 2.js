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


function loginlogic(){
    // Check for the "cart" cookie and store its value if it exists
    if (req.cookies && req.cookies.cart) {
      let cart = req.cookies.cart

      if(cart.userID.startsWith("Guest :")){
        
        //check if thers a matching db cart
        
            //yes
            if(checkIfCartExistsInDB(req, res, cart, connection).Length === 1){

                const cartResults = checkIfCartExistsInDB(req, res, cart, connection)

                loginFoundMatchingCart(res, cart, connection, cartResults)
            }
            //no
            else{

            }

            //no

      } else {

        let cart = newCartForAuthUser() 

        newEmptyCartToDB(res ,cart ,connection)
      }
      
    }else{
      
    }
    // Access the cartValue here and use it as needed
    let { userID, cartID, created, updated } = cart;
}


// all functions below this point


function newCartForAuthUser() {
let timestamp = new Date().getTime();
let cart = {};
cart.cartID = uuidv4();
cart.userID = req.user.email;
cart.created = timestamp;
cart.updated = timestamp;
return cart;
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

async function newEmptyCartToDB(res, cart, connection) {
    try {
        const { cartID, userID, created, updated } = cart;

        // SQL query 1 (using promise-based API)
        const insertCartQuery = "INSERT INTO carts (cart_id, user_id, created, modified) VALUES (?,?,?,?)";
        const insertCartValues = [cartID, userID, created, updated];
        const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);

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

async function checkIfCartExistsInDB(req, res, cart, connection) {
    try {
      const { userID, cartID} = cart;

      // SQL query 1 (using promise-based API) - check to see if there's a matching
    // username cart as the logged-in user.
    const checkCartQuery = "SELECT * FROM carts WHERE user_id = ?";
    const [cartResults] = await connection.promise().query(checkCartQuery, [req.user.email]);

    return cartResults;

    }
    catch (error){
        console.error(error);
        res.status(500).send("Error finding cart");
    }
}

async function loginFoundMatchingCart(res, cart, connection, cartResults) {
    const { cart_id, user_id } = cartResults[0];
    const { cartID} = cart
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

    res
        .cookie("cart", cart, { maxAge: 3600000 })
        .status(200)
        .send(`Cart saved for ${cart.userID}.`);
}