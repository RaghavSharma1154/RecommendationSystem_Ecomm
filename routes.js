

// Login route
router.get('/login', (req, res) => {
  res.render('login'); // Render your login/signup page
});

// Post request on login/
router.post('/login', async (req, res) => {
    const { uname, pass } = req.body;
    try {
        await client.connect();
        const user = await usersCollection.findOne({ username: uname });
        if (user && bcrypt.compareSync(pass, user.password)) {
            res.send('Login Successful');
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

//Post request on sign-up -->
router.post('/sign-up', async (req, res) => {
    const { uname, email, pass } = req.body;
    try {
        await client.connect();
        const existingUser = await usersCollection.findOne({ username: uname });
        if (existingUser) {
            res.send('Username already exists');
            return;
        }

        const hashedPassword = bcrypt.hashSync(pass, 10);
        await usersCollection.insertOne({ username: uname, email, password: hashedPassword });
        res.send('Signup Successful');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// Product view route
router.get('/view-product/:productId', isAuthenticated, async (req, res) => {
    try {
        await client.connect();
        const productId = req.params.productId;
        const db = client.db('raghav');
        const productsCollection = db.collection('products');
        const product = await productsCollection.findOne({ _id: new ObjectId(productId) }); // Correct usage of ObjectId
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('view-product', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = {router,isAuthenticated};
