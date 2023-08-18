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
            res.cookie('cart', cart, { maxAge: 3600000 })
                .status(200).send('Cart saved for ' + cart.userID)
        }

        //if cart belongs to this user 
        else if (userID === req.user.email) {
            cart.updated = new Date().getTime();
            //rest of code



            console.log(cart);
            // send response
            res.cookie('cart', cart, { maxAge: 3600000 })
                .status(200).send('Cart saved for ' + cart.userID)
        }

        //if cart belongs to another user
        else {
            let timestamp = new Date().getTime()
            let cart = {}
            cart.cartID = uuidv4();
            cart.userID = req.user.email;
            cart.created = timestamp;
            cart.updated = timestamp;
            //rest of code



            console.log(cart);
            // send response
            res.cookie('cart', cart, { maxAge: 3600000 })
                .status(200).send('Cart saved for ' + cart.userID)
        }
    } else {
        // Scinario 2. Logged-In User Creates a Cart:
        let timestamp = new Date().getTime()
        let cart = {}
        cart.cartID = uuidv4();
        cart.userID = req.user.email;
        cart.created = timestamp;
        cart.updated = timestamp;

        res.cookie('cart', cart, { maxAge: 3600000 })
            .status(200).send('Cart saved for Guest Shopper')
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
            console.log(cart);
            // send response
            res.cookie('cart', cart, { maxAge: 3600000 })
                .status(200).send('Cart saved for Guest')
        }

        //if cart belongs to a user
        else {
            let timestamp = new Date().getTime()
            let cart = {}
            cart.cartID = uuidv4();
            cart.userID = 'Guest : ' + uuidv4();
            cart.created = timestamp;
            cart.updated = timestamp;
            //rest of code



            console.log(cart);
            // send response
            res.cookie('cart', cart, { maxAge: 3600000 })
                .status(200).send('Cart saved for ' + cart.userID)
        }

    } else {
        let timestamp = new Date().getTime()
        let cart = {}
        cart.cartID = uuidv4();
        cart.userID = 'Guest : ' + uuidv4();
        cart.created = timestamp;
        cart.updated = timestamp;
        //rest of code



        console.log(cart);
        // send response
        res.cookie('cart', cart, { maxAge: 3600000 })
            .status(200).send('Cart saved for ' + cart.userID)
    }
}

// code is not DRY but gawd it works

