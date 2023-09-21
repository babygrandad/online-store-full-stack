//all previous versionfs
function prevVersions() {

  // function verssion1() {
  //   function newCartForAuthUser() {
  //     let timestamp = new Date().getTime()
  //     let cart = {}
  //     cart.cartID = uuidv4();
  //     cart.userID = req.user.email;
  //     cart.created = timestamp;
  //     cart.updated = timestamp;
  //     return cart;
  //   }

  //   function newCartForGuest() {
  //     let timestamp = new Date().getTime()
  //     let cart = {}
  //     cart.cartID = uuidv4();
  //     cart.userID = 'Guest : ' + uuidv4();
  //     cart.created = timestamp;
  //     cart.updated = timestamp;
  //     return cart;
  //   }

  //   function responseWithCookie(res, cart, user) {
  //     res.cookie('cart', cart, { expires: new Date(new Date().getTime() + 3600000) })
  //       .status(200).send(`Cart saved for ${user}.`)
  //   }

  //   if (req.isAuthenticated()) {
  //     //scinario 1. User Makes a Cart as Guest and Then Logs In:
  //     if (req.cookies.cart) {
  //       const cart = req.cookies.cart;
  //       const userID = cart.userID;

  //       //check who the cart belongs to.
  //       //if cart belongs to guest
  //       if (userID.startsWith('Guest :')) {
  //         cart.userID = req.user.email
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         responseWithCookie(res, cart, cart.userID);
  //       }

  //       //if cart belongs to this user 
  //       else if (userID === req.user.email) {
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         responseWithCookie(res, cart, cart.userID);
  //       }

  //       //if cart belongs to another user
  //       else {
  //         let cart = newCartForAuthUser()
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         responseWithCookie(res, cart, cart.userID);
  //       }
  //     } else {
  //       // Scinario 2. Logged-In User Creates a Cart:
  //       let cart = newCartForAuthUser();
  //       console.log(cart);
  //       // send response
  //       responseWithCookie(res, cart, cart.userID);
  //     }
  //   } else {
  //     if (req.cookies.cart) {
  //       const cart = req.cookies.cart;
  //       const userID = cart.userID;
  //       //Check who the cart belongs to

  //       //if cart belongs belongs to a guest
  //       if (userID.startsWith('Guest :')) {
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         responseWithCookie(res, cart, "Guest shopper");
  //       }

  //       //if cart belongs to a user
  //       else {
  //         let cart = newCartForGuest();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         responseWithCookie(res, cart, "Guest shopper");
  //       }

  //     } else {
  //       let cart = newCartForGuest();
  //       //rest of code

  //       console.log(cart);
  //       // send response
  //       responseWithCookie(res, cart, "Guest shopper");
  //     }
  //   }

  // }
  // /*Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum, sunt.
  // Rem ipsum deleniti ex aliquid illo accusantium, voluptatum sed exercitationem
  // reiciendis doloribus tempora molestiae suscipit excepturi similique corrupti
  // illum saepe minus quibusdam magnam obcaecati laudantium eos mollitia nulla.
  // Praesentium iusto iste aspernatur. Et aliquam nam cupiditate voluptatum exercitationem eum,
  // possimus modi reiciendis a quia nesciunt, blanditiis aut aliquid veniam odit
  // porro. Deserunt illo fugiat quod libero excepturi itaque similique perspiciatis
  // repellat nostrum explicabo est facere, veniam distinctio unde. Voluptatibus et suscipit
  // asperiores odit amet quam quisquam enim doloremque necessitatibus est ea quae,
  // laudantium dolores perferendis quae. Dignissimos consectetur ratione dolores quos
  // rem esse temporibus ipsum totam inventore at, 
  // nemo excepturi facilis quod sed sit harum sequi reiciendis vel.*/

  // function version2() {
  //   let newItem = { color, size, quantity, productID, entryID } = req.body;

  //   function newCartToDB(connection, cart, res) {
  //     const { cartID, userID, created, updated } = cart;

  //     connection.query(
  //       'INSERT INTO carts (cart_id, user_id, created, modified) VALUES (?,?,?,?)',
  //       [cartID, userID, created, updated],
  //       (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).send("Error saving cart. Please try again");
  //           return;
  //         }
  //         // Registration successful
  //         responseWithCookie(res, cart, "Guest shopper");
  //       }
  //     );
  //   }

  //   function updateModifedInDB(connection, cart, res) {
  //     const { cartID, updated } = cart;

  //     connection.query(
  //       'UPDATE carts SET modified = ? WHERE cart_id = ?',
  //       [updated, cartID],
  //       (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).send("Error saving cart. Please try again");
  //           return;
  //         }
  //         // Registration successful
  //         responseWithCookie(res, cart, "Guest shopper");
  //       }
  //     );
  //   }

  //   function updateUserIDandModifedInDB(connection, cart, res) {
  //     const { cartID, userID, updated } = cart;

  //     connection.query(
  //       'UPDATE carts SET user_id = ?, modified = ? WHERE cart_id = ?',
  //       [userID, updated, cartID],
  //       (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).send("Error saving cart. Please try again");
  //           return;
  //         }
  //         // Registration successful
  //         responseWithCookie(res, cart, "Guest shopper");
  //       }
  //     );
  //   }

  //   function newCartForAuthUser() {
  //     let timestamp = new Date().getTime()
  //     let cart = {}
  //     cart.cartID = uuidv4();
  //     cart.userID = req.user.email;
  //     cart.created = timestamp;
  //     cart.updated = timestamp;
  //     return cart;
  //   }

  //   function newCartForGuest() {
  //     let timestamp = new Date().getTime()
  //     let cart = {}
  //     cart.cartID = uuidv4();
  //     cart.userID = 'Guest : ' + uuidv4();
  //     cart.created = timestamp;
  //     cart.updated = timestamp;
  //     return cart;
  //   }

  //   function responseWithCookie(res, cart, user) {
  //     res.cookie('cart', cart, { expires: new Date(new Date().getTime() + 3600000) })
  //       .status(200).send(`Cart saved for ${user}.`)
  //   }

  //   if (req.isAuthenticated()) {
  //     //scinario 1. User Makes a Cart as Guest and Then Logs In:
  //     if (req.cookies.cart) {
  //       const cart = req.cookies.cart;
  //       const userID = cart.userID;

  //       //check who the cart belongs to.

  //       if (userID.startsWith('Guest :')) {//if cart belongs to guest 
  //         cart.userID = req.user.email
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         updateUserIDandModifedInDB(connection, cart, res); //update userID & modified in DB
  //       }
  //       else if (userID === req.user.email) {//if cart belongs to this user 
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         updateModifedInDB(connection, cart, res); //Only update the modified field in DB

  //       }
  //       else {//if cart belongs to another user
  //         let cart = newCartForAuthUser();
  //         //rest of code
  //         console.log(cart)
  //         newCartToDB(connection, cart, res); // Add a brand new cart to the DB
  //       }
  //     }
  //     else {// Scinario 2. Logged-In User Creates a Cart:

  //       let cart = newCartForAuthUser();
  //       console.log(cart);
  //       // send response
  //       newCartToDB(connection, cart, res); // Add a brand new cart to the DB
  //     }
  //   }
  //   else {
  //     if (req.cookies.cart) {
  //       const cart = req.cookies.cart;
  //       const userID = cart.userID;

  //       //Check who the cart belongs to

  //       if (userID.startsWith('Guest :')) {//if cart belongs belongs to a guest
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         updateModifedInDB(connection, cart, res); //Only update the modified field in DB

  //       }
  //       else {//if cart belongs to a user
  //         let cart = newCartForGuest();

  //         console.log(cart);
  //         // send cart to bd
  //         newCartToDB(connection, cart, res); // Add a brand new cart to the DB
  //       }

  //     }
  //     else { // Unregistared user creates a new cart
  //       let cart = newCartForGuest();
  //       //rest of code
  //       newItem.cartID = cart.cartID

  //       console.log(cart);
  //       //Put cart into DB
  //       newCartToDB(connection, cart, res); // Add a brand new cart to the DB
  //     }

  //   }
  // }

  // /*Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum, sunt.
  // Rem ipsum deleniti ex aliquid illo accusantium, voluptatum sed exercitationem
  // reiciendis doloribus tempora molestiae suscipit excepturi similique corrupti
  // illum saepe minus quibusdam magnam obcaecati laudantium eos mollitia nulla.
  // Praesentium iusto iste aspernatur. Et aliquam nam cupiditate voluptatum exercitationem eum,
  // possimus modi reiciendis a quia nesciunt, blanditiis aut aliquid veniam odit
  // porro. Deserunt illo fugiat quod libero excepturi itaque similique perspiciatis
  // repellat nostrum explicabo est facere, veniam distinctio unde. Voluptatibus et suscipit
  // asperiores odit amet quam quisquam enim doloremque necessitatibus est ea quae,
  // laudantium dolores perferendis quae. Dignissimos consectetur ratione dolores quos
  // rem esse temporibus ipsum totam inventore at, 
  // nemo excepturi facilis quod sed sit harum sequi reiciendis vel.*/

  // function version3() {
  //   function newCartToDB(connection, cart, res, req) {
  //     const { cartID, userID, created, updated } = cart;

  //     connection.query(
  //       "INSERT INTO carts (cart_id, user_id, created, modified) VALUES (?,?,?,?)",
  //       [cartID, userID, created, updated],
  //       (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).send("Error saving cart. Please try again");
  //           return;
  //         }
  //         // Registration successful
  //         addcartItemToDB(req, res, cart, connection);
  //       }
  //     );
  //   }

  //   function updateModifedInDB(connection, cart, res, req) {
  //     const { cartID, updated } = cart;

  //     connection.query(
  //       "UPDATE carts SET modified = ? WHERE cart_id = ?",
  //       [updated, cartID],
  //       (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).send("Error saving cart. Please try again");
  //           return;
  //         }
  //         // Registration successful
  //         addcartItemToDB(req, res, cart, connection);
  //       }
  //     );
  //   }

  //   function updateUserIDandModifedInDB(connection, cart, res, req) {
  //     const { cartID, userID, updated } = cart;

  //     connection.query(
  //       "UPDATE carts SET user_id = ?, modified = ? WHERE cart_id = ?",
  //       [userID, updated, cartID],
  //       (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).send("Error saving cart. Please try again");
  //           return;
  //         }
  //         // Registration successful
  //         addcartItemToDB(req, res, cart, connection);
  //       }
  //     );
  //   }

  //   function addcartItemToDB(req, res, cart, connection) {
  //     let { color, size, quantity, productID, entryID } = req.body;
  //     connection.query(
  //       "INSERT INTO cart_items (cart_id, entry_id, product_id, color, size, quantity) VALUES (?,?,?,?,?,?)",
  //       [cart.cartID, entryID, productID, color, size, quantity],
  //       (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).send("Error saving cart. Please try again");
  //           return;
  //         }
  //         // Registration successful
  //         function determineUser() {
  //           if (cart.userID === req.user.email) {
  //             return cart.userID;
  //           } else {
  //             return "Guest User";
  //           }
  //         }
  //         res
  //           .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
  //           .status(200)
  //           .send(`Cart saved for ${determineUser()}.`);
  //       }
  //     );
  //   }

  //   function newCartForAuthUser() {
  //     let timestamp = new Date().getTime();
  //     let cart = {};
  //     cart.cartID = uuidv4();
  //     cart.userID = req.user.email;
  //     cart.created = timestamp;
  //     cart.updated = timestamp;
  //     return cart;
  //   }

  //   function newCartForGuest() {
  //     let timestamp = new Date().getTime();
  //     let cart = {};
  //     cart.cartID = uuidv4();
  //     cart.userID = "Guest : " + uuidv4();
  //     cart.created = timestamp;
  //     cart.updated = timestamp;
  //     return cart;
  //   }

  //   if (req.isAuthenticated()) {
  //     //scinario 1. User Makes a Cart as Guest and Then Logs In:
  //     if (req.cookies.cart) {
  //       const cart = req.cookies.cart;
  //       const userID = cart.userID;

  //       //check who the cart belongs to.

  //       if (userID.startsWith("Guest :")) {
  //         //if cart belongs to guest
  //         cart.userID = req.user.email;
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         updateUserIDandModifedInDB(connection, cart, res, req); //update userID & modified in DB
  //       } else if (userID === req.user.email) {
  //         //if cart belongs to this user
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         updateModifedInDB(connection, cart, res, req); //Only update the modified field in DB
  //       } else {
  //         //if cart belongs to another user
  //         let cart = newCartForAuthUser();
  //         //rest of code
  //         console.log(cart);
  //         newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
  //       }
  //     } else {
  //       // Scinario 2. Logged-In User Creates a Cart:

  //       let cart = newCartForAuthUser();
  //       console.log(cart);
  //       // send response
  //       newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
  //     }
  //   } else {
  //     if (req.cookies.cart) {
  //       const cart = req.cookies.cart;
  //       const userID = cart.userID;

  //       //Check who the cart belongs to

  //       if (userID.startsWith("Guest :")) {
  //         //if cart belongs belongs to a guest
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         updateModifedInDB(connection, cart, res, req); //Only update the modified field in DB
  //       } else {
  //         //if cart belongs to a user
  //         let cart = newCartForGuest();

  //         console.log(cart);
  //         // send cart to bd
  //         newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
  //       }
  //     } else {
  //       // Unregistared user creates a new cart
  //       let cart = newCartForGuest();
  //       //rest of code

  //       console.log(cart);
  //       //Put cart into DB
  //       newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
  //     }
  //   }
  // }


  // // working version 4 - Only need to update async funtion for the other
  // //remaining normal fuctions
  // function version4() {
  //   async function newCartToDB(connection, cart, res, req) {
  //     try {
  //       const { cartID, userID, created, updated } = cart;

  //       // SQL query 1 (using promise-based API)
  //       const insertCartQuery = "INSERT INTO carts (cart_id, user_id, created, modified) VALUES (?,?,?,?)";
  //       const insertCartValues = [cartID, userID, created, updated];
  //       const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);

  //       // SQL query 2 (using promise-based API)
  //       const { color, size, quantity, productID, entryID } = req.body;
  //       const insertItemsQuery = "INSERT INTO cart_items (cart_id, entry_id, product_id, color, size, quantity) VALUES (?,?,?,?,?,?)";
  //       const insertItemsValues = [cartID, entryID, productID, color, size, quantity];
  //       const [itemsResults] = await connection.promise().query(insertItemsQuery, insertItemsValues);

  //       function determineUser() {
  //         if (userID.startsWith("Guest :")) {
  //           return "Guest User";
  //         } else {
  //           return userID;
  //         }
  //       }

  //       // Handle response here
  //       res
  //         .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
  //         .status(200)
  //         .send(`Cart saved for ${determineUser()}.`);
  //     } catch (error) {
  //       // Handle any error
  //       console.error(error);
  //       res.status(500).send("Error saving cart. Please try again");
  //     }
  //   }

  //   function updateModifedInDB(connection, cart, res, req) {
  //     const { cartID, updated } = cart;

  //     connection.query(
  //       "UPDATE carts SET modified = ? WHERE cart_id = ?",
  //       [updated, cartID],
  //       (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).send("Error saving cart. Please try again");
  //           return;
  //         }
  //         // Registration successful
  //         addcartItemToDB(req, res, cart, connection);
  //       }
  //     );
  //   }

  //   function updateUserIDandModifedInDB(connection, cart, res, req) {
  //     const { cartID, userID, updated } = cart;

  //     connection.query(
  //       "UPDATE carts SET user_id = ?, modified = ? WHERE cart_id = ?",
  //       [userID, updated, cartID],
  //       (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).send("Error saving cart. Please try again");
  //           return;
  //         }
  //         // Registration successful
  //         addcartItemToDB(req, res, cart, connection);
  //       }
  //     );
  //   }

  //   function addcartItemToDB(req, res, cart, connection) {
  //     let { color, size, quantity, productID, entryID } = req.body;
  //     connection.query(
  //       "INSERT INTO cart_items (cart_id, entry_id, product_id, color, size, quantity) VALUES (?,?,?,?,?,?)",
  //       [cart.cartID, entryID, productID, color, size, quantity],
  //       (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           res.status(500).send("Error saving cart. Please try again");
  //           return;
  //         }
  //         // Registration successful
  //         function determineUser() {
  //           if (cart.userID === req.user.email) {
  //             return cart.userID;
  //           } else {
  //             return "Guest User";
  //           }
  //         }
  //         res
  //           .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
  //           .status(200)
  //           .send(`Cart saved for ${determineUser()}.`);
  //       }
  //     );
  //   }

  //   function newCartForAuthUser() {
  //     let timestamp = new Date().getTime();
  //     let cart = {};
  //     cart.cartID = uuidv4();
  //     cart.userID = req.user.email;
  //     cart.created = timestamp;
  //     cart.updated = timestamp;
  //     return cart;
  //   }

  //   function newCartForGuest() {
  //     let timestamp = new Date().getTime();
  //     let cart = {};
  //     cart.cartID = uuidv4();
  //     cart.userID = "Guest : " + uuidv4();
  //     cart.created = timestamp;
  //     cart.updated = timestamp;
  //     return cart;
  //   }

  //   if (req.isAuthenticated()) {
  //     //scinario 1. User Makes a Cart as Guest and Then Logs In:
  //     if (req.cookies.cart) {
  //       const cart = req.cookies.cart;
  //       const userID = cart.userID;

  //       //check who the cart belongs to.

  //       if (userID.startsWith("Guest :")) {
  //         //if cart belongs to guest
  //         cart.userID = req.user.email;
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         updateUserIDandModifedInDB(connection, cart, res, req); //update userID & modified in DB
  //       } else if (userID === req.user.email) {
  //         //if cart belongs to this user
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         updateModifedInDB(connection, cart, res, req); //Only update the modified field in DB
  //       } else {
  //         //if cart belongs to another user
  //         let cart = newCartForAuthUser();
  //         //rest of code
  //         console.log(cart);
  //         newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
  //       }
  //     } else {
  //       // Scinario 2. Logged-In User Creates a Cart:

  //       let cart = newCartForAuthUser();
  //       console.log(cart);
  //       // send response
  //       newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
  //     }
  //   } else {
  //     if (req.cookies.cart) {
  //       const cart = req.cookies.cart;
  //       const userID = cart.userID;

  //       //Check who the cart belongs to

  //       if (userID.startsWith("Guest :")) {
  //         //if cart belongs belongs to a guest
  //         cart.updated = new Date().getTime();
  //         //rest of code

  //         console.log(cart);
  //         // send response
  //         updateModifedInDB(connection, cart, res, req); //Only update the modified field in DB
  //       } else {
  //         //if cart belongs to a user
  //         let cart = newCartForGuest();

  //         console.log(cart);
  //         // send cart to bd
  //         newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
  //       }
  //     } else {
  //       // Unregistared user creates a new cart
  //       let cart = newCartForGuest();
  //       //rest of code

  //       console.log(cart);
  //       //Put cart into DB
  //       newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
  //     }
  //   }
  // }
}


//current working version of code. Cart Planner. cart/add complete
function version4Updating() {

  async function newCartToDB(connection, cart, res, req) {
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
        .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
        .status(200)
        .send(`Cart saved for ${determineUser()}.`);
    } catch (error) {
      // Handle any error
      console.error(error);
      res.status(500).send("Error saving cart. Please try again");
    }
  }

  async function updateModifedInDB(connection, cart, res, req) {
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
        .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
        .status(200)
        .send(`Cart saved for ${determineUser()}.`);
    } catch (error) {
      // Handle any error
      console.error(error);
      res.status(500).send("Error saving cart. Please try again");
    }
  }

  async function updateUserIDandModifedInDB(connection, cart, res, req) {
    try {
      const { cartID, userID, updated } = cart;

      // SQL query 1 (using promise-based API)
      const insertCartQuery = "UPDATE carts SET user_id = ?, modified = ? WHERE cart_id = ?";
      const insertCartValues = [userID, updated, cartID];
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
        .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
        .status(200)
        .send(`Cart saved for ${determineUser()}.`);
    } catch (error) {
      // Handle any error
      console.error(error);
      res.status(500).send("Error saving cart. Please try again");
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

  function newCartForGuest() {
    let timestamp = new Date().getTime();
    let cart = {};
    cart.cartID = uuidv4();
    cart.userID = "Guest : " + uuidv4();
    cart.created = timestamp;
    cart.updated = timestamp;
    return cart;
  }

  if (req.isAuthenticated()) {
    //scinario 1. User Makes a Cart as Guest and Then Logs In:
    if (req.cookies.cart) {
      const cart = req.cookies.cart;
      const userID = cart.userID;

      //check who the cart belongs to.

      if (userID.startsWith("Guest :")) {
        //if cart belongs to guest
        cart.userID = req.user.email;
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        updateUserIDandModifedInDB(connection, cart, res, req); //update userID & modified in DB
      } else if (userID === req.user.email) {
        //if cart belongs to this user
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        updateModifedInDB(connection, cart, res, req); //Only update the modified field in DB
      } else {
        //if cart belongs to another user
        let cart = newCartForAuthUser();
        //rest of code
        console.log(cart);
        newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
      }
    } else {
      // Scinario 2. Logged-In User Creates a Cart:

      let cart = newCartForAuthUser();
      console.log(cart);
      // send response
      newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
    }
  } else {
    if (req.cookies.cart) {
      const cart = req.cookies.cart;
      const userID = cart.userID;

      //Check who the cart belongs to

      if (userID.startsWith("Guest :")) {
        //if cart belongs belongs to a guest
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        updateModifedInDB(connection, cart, res, req); //Only update the modified field in DB
      } else {
        //if cart belongs to a user
        let cart = newCartForGuest();

        console.log(cart);
        // send cart to bd
        newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
      }
    } else {
      // Unregistared user creates a new cart
      let cart = newCartForGuest();
      //rest of code

      console.log(cart);
      //Put cart into DB
      newCartToDB(connection, cart, res, req); // Add a brand new cart to the DB
    }
  }

}



