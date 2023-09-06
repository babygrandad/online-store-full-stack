async function checkIfCartExistsInDB(req, res, cart, connection) {
    try {
      const { userID, cartID} = cart;
  
      // SQL query 1 (using promise-based API) - check to see if there's a matching
      // username cart as the logged-in user.
      const checkCartQuery = "SELECT * FROM carts WHERE user_id = ?";
      const [cartResults] = await connection.promise().query(checkCartQuery, [req.user.email]);
  
      // If there is a matching cart in the database
      if (cartResults.length === 1) {
        const { cart_id, user_id } = cartResults[0];
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
      } else {
        // Code for handling the case where there is no matching cart in the database
        
        
      }
    } catch (error) {
      // Handle any error
      console.error(error);
      res.status(500).send("Error saving cart. Please try again");
    }
  }