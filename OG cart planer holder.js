app.route('/cart/update')
  .patch((req, res) => {
    const { newQuantity, productId, entryId } = req.body;
    const cart = req.cookies.cart;

    // Start a transaction to ensure all queries succeed or fail together
    connection.beginTransaction(function (beginTransactionErr) {
      if (beginTransactionErr) {
        console.error(beginTransactionErr);
        return res.status(500).json({ error: 'Database error' });
      }

      // Update the quantity in the 'cart_items' table
      const updateQuantitySql = 'UPDATE cart_items SET quantity = ? WHERE product_id = ? AND entry_id = ?';
      const updateQuantityValues = [newQuantity, productId, entryId];

      connection.query(updateQuantitySql, updateQuantityValues, function (updateQuantityErr, updateQuantityResults) {
        if (updateQuantityErr) {
          // Rollback the transaction on error
          connection.rollback(function () {
            console.error(updateQuantityErr);
            return res.status(500).json({ error: 'Database error' });
          });
        } else {
          // Update the 'modified' timestamp in the 'carts' table
          const updateModifiedSql = 'UPDATE carts SET modified = ? WHERE cart_id = ?';
          const currentTime = new Date().getTime();
          const updateModifiedValues = [currentTime, cart.cartID];

          connection.query(updateModifiedSql, updateModifiedValues, function (updateModifiedErr, updateModifiedResults) {
            if (updateModifiedErr) {
              // Rollback the transaction on error
              connection.rollback(function () {
                console.error(updateModifiedErr);
                return res.status(500).json({ error: 'Database error' });
              });
            } else {
              // Execute the SELECT query to calculate the total quantity in 'cart_items'
              const calculateTotalQuantitySql = 'SELECT SUM(quantity) AS count_value FROM cart_items WHERE cart_id = ?';
              const calculateTotalQuantityValues = [cart.cartID];

              connection.query(calculateTotalQuantitySql, calculateTotalQuantityValues, function (calculateTotalQuantityErr, calculateTotalQuantityResults) {
                if (calculateTotalQuantityErr) {
                  // Rollback the transaction on error
                  connection.rollback(function () {
                    console.error(calculateTotalQuantityErr);
                    return res.status(500).json({ error: 'Database error' });
                  });
                } else {
                  // Commit the transaction if all queries are successful
                  connection.commit(function (commitErr) {
                    if (commitErr) {
                      // Rollback the transaction on error
                      connection.rollback(function () {
                        console.error(commitErr);
                        return res.status(500).json({ error: 'Database error' });
                      });
                    } else {
                      // Send a success response with the updated total quantity
                      const totalQuantity = calculateTotalQuantityResults[0].count_value;
                      cart.updated = currentTime;
                      cart.sumQuantity = totalQuantity;
                      console.log(cart);
                      return res
                        .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
                        .status(200)
                        .send('Item removed from cart and modified timestamp updated successfully');
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });
