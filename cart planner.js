//

function verssion1(){
  function newCartForAuthUser() {
    let timestamp = new Date().getTime()
    let cart = {}
    cart.cartID = uuidv4();
    cart.userID = req.user.email;
    cart.created = timestamp;
    cart.updated = timestamp;
    return cart;
  }

  function newCartForGuest() {
    let timestamp = new Date().getTime()
    let cart = {}
    cart.cartID = uuidv4();
    cart.userID = 'Guest : ' + uuidv4();
    cart.created = timestamp;
    cart.updated = timestamp;
    return cart;
  }

  function responseWithCookie(res, cart, user) {
    res.cookie('cart', cart, { maxAge: 3600000 })
      .status(200).send(`Cart saved for ${user}.`)
  }

  if (req.isAuthenticated()) {
    //scinario 1. User Makes a Cart as Guest and Then Logs In:
    if (req.cookies.cart) {
      const cart = req.cookies.cart;
      const userID = cart.userID;

      //check who the cart belongs to.
      //if cart belongs to guest
      if (userID.startsWith('Guest :')) {
        cart.userID = req.user.email
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        responseWithCookie(res, cart, cart.userID);
      }

      //if cart belongs to this user 
      else if (userID === req.user.email) {
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        responseWithCookie(res, cart, cart.userID);
      }

      //if cart belongs to another user
      else {
        let cart = newCartForAuthUser()
        //rest of code

        console.log(cart);
        // send response
        responseWithCookie(res, cart, cart.userID);
      }
    } else {
      // Scinario 2. Logged-In User Creates a Cart:
      let cart = newCartForAuthUser();
      console.log(cart);
      // send response
      responseWithCookie(res, cart, cart.userID);
    }
  } else {
    if (req.cookies.cart) {
      const cart = req.cookies.cart;
      const userID = cart.userID;
      //Check who the cart belongs to

      //if cart belongs belongs to a guest
      if (userID.startsWith('Guest :')) {
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        responseWithCookie(res, cart, "Guest shopper");
      }

      //if cart belongs to a user
      else {
        let cart = newCartForGuest();
        //rest of code

        console.log(cart);
        // send response
        responseWithCookie(res, cart, "Guest shopper");
      }

    } else {
      let cart = newCartForGuest();
      //rest of code

      console.log(cart);
      // send response
      responseWithCookie(res, cart, "Guest shopper");
    }
  }

}
/*Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum, sunt.
Rem ipsum deleniti ex aliquid illo accusantium, voluptatum sed exercitationem
reiciendis doloribus tempora molestiae suscipit excepturi similique corrupti
illum saepe minus quibusdam magnam obcaecati laudantium eos mollitia nulla.
Praesentium iusto iste aspernatur. Et aliquam nam cupiditate voluptatum exercitationem eum,
possimus modi reiciendis a quia nesciunt, blanditiis aut aliquid veniam odit
porro. Deserunt illo fugiat quod libero excepturi itaque similique perspiciatis
repellat nostrum explicabo est facere, veniam distinctio unde. Voluptatibus et suscipit
asperiores odit amet quam quisquam enim doloremque necessitatibus est ea quae,
laudantium dolores perferendis quae. Dignissimos consectetur ratione dolores quos
rem esse temporibus ipsum totam inventore at, 
nemo excepturi facilis quod sed sit harum sequi reiciendis vel.*/

function version2() {
  let newItem = { color, size, quantity, productID, entryID } = req.body;

  function newCartToDB(connection, cart, res) {
    const { cartID, userID, created, updated } = cart;

    connection.query(
      'INSERT INTO carts (cart_id, user_id, created, modified) VALUES (?,?,?,?)',
      [cartID, userID, created, updated],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send("Error saving cart. Please try again");
          return;
        }
        // Registration successful
        responseWithCookie(res, cart, "Guest shopper");
      }
    );
  }
  
  function updateModifedInDB(connection, cart, res) {
    const { cartID, updated } = cart;

    connection.query(
      'UPDATE carts SET modified = ? WHERE cart_id = ?',
      [updated, cartID],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send("Error saving cart. Please try again");
          return;
        }
        // Registration successful
        responseWithCookie(res, cart, "Guest shopper");
      }
    );
  }

  function updateUserIDandModifedInDB(connection, cart, res) {
    const { cartID, userID, updated } = cart;

    connection.query(
      'UPDATE carts SET user_id = ?, modified = ? WHERE cart_id = ?',
      [userID, updated, cartID],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send("Error saving cart. Please try again");
          return;
        }
        // Registration successful
        responseWithCookie(res, cart, "Guest shopper");
      }
    );
  }

  function newCartForAuthUser() {
    let timestamp = new Date().getTime()
    let cart = {}
    cart.cartID = uuidv4();
    cart.userID = req.user.email;
    cart.created = timestamp;
    cart.updated = timestamp;
    return cart;
  }

  function newCartForGuest() {
    let timestamp = new Date().getTime()
    let cart = {}
    cart.cartID = uuidv4();
    cart.userID = 'Guest : ' + uuidv4();
    cart.created = timestamp;
    cart.updated = timestamp;
    return cart;
  }

  function responseWithCookie(res, cart, user) {
    res.cookie('cart', cart, { maxAge: 3600000 })
      .status(200).send(`Cart saved for ${user}.`)
  }



  if (req.isAuthenticated()) {
    //scinario 1. User Makes a Cart as Guest and Then Logs In:
    if (req.cookies.cart) {
      const cart = req.cookies.cart;
      const userID = cart.userID;

      //check who the cart belongs to.
      //if cart belongs to guest ******************************* update only userid and updated
      if (userID.startsWith('Guest :')) {
        cart.userID = req.user.email
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        responseWithCookie(res, cart, cart.userID);
      }

      //if cart belongs to this user *********************** update only cart.updated 
      else if (userID === req.user.email) {
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        updateModifedInDB(connection, cart, res);
      }

      //if cart belongs to another user
      else {
        let cart = newCartForAuthUser()
        //rest of code
        console.log(cart);
        // Send cart to DB
        newCartToDB(connection, cart, res);
      }
    } else {
      // Scinario 2. Logged-In User Creates a Cart:
      let cart = newCartForAuthUser();
      console.log(cart);
      // send response
      responseWithCookie(res, cart, cart.userID);
    }
  } else {
    if (req.cookies.cart) {
      const cart = req.cookies.cart;
      const userID = cart.userID;
      //Check who the cart belongs to

      //if cart belongs belongs to a guest ************************************update onlycart.updated
      if (userID.startsWith('Guest :')) {
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        updateModifedInDB(connection, cart, res);
      }

      //if cart belongs to a user
      else {
        let cart = newCartForGuest();
        
        console.log(cart);
        // send cart to bd
        newCartToDB(connection, cart, res);
      }

    } else {
      let cart = newCartForGuest();
      //rest of code
      newItem.cartID = cart.cartID

      console.log(cart);
      //Put cart into DB
      newCartToDB(connection, cart, res);
    }
  }
}



