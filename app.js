//Packages -->
const express = require('express');
const app = express();
const ejs = require('ejs');
const PORT = 3000;
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const path = require('path');

//Middlewares -->
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

//Routes -->
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.get('/', (req, res) => {
//     res.render('home', { products : products});
// })

// app.get('/cart', async(req, res) => {
//     try {
//         // Connect to the database
//         await client.connect();

//         // Select the database and collection
//         const db = client.db('raghav');
//         const productsCollection = db.collection('cart');

//         // Fetch all products from the collection
//         const products = await productsCollection.find().toArray();

//         // Render the home page with the fetched products
//         res.render('cart', { products: products });
//     } catch (err) {
//         console.error('Failed to fetch products:', err);
//         res.status(500).send('An error occurred while fetching products');
//     } finally {
//         // Close the database connection
//         await client.close();
//     }
// })

app.use(express.json());



app.get('/onsearch', (req, res) => {
    const query = req.body.query
    res.render('onsearch', { products: [], query: query });
})

//commented here to perform modification in filter pannel-->
app.post('/search', async(req, res) => {
    const query = req.body.query;
    const products = await scrapeProducts(query);
    res.render('onsearch', { products: products, query: query });
});
app.get('/Mens', async(req, res) => {
    const query = 'Mens Products';
    const products = await scrapeProducts(query);
    res.render('onsearch', { products, query: query });
});
app.get('/Womens', async(req, res) => {
    const query = 'Womens Products';
    const products = await scrapeProducts(query);
    res.render('onsearch', { products, query: query });
});
app.get('/Kids', async(req, res) => {
    const query = 'Kids Products';
    const products = await scrapeProducts(query);
    res.render('onsearch', { products, query: query });
});
app.get('/Bags_Footwear', async(req, res) => {
    const query = 'bag and footwears';
    const products = await scrapeProducts(query);
    res.render('onsearch', { products, query: query });
});
app.get('/Grocery', async(req, res) => {
    const query = 'Grocery';
    const products = await scrapeProducts(query);
    res.render('onsearch', { products, query: query });
});
app.get('/Electronics', async(req, res) => {
    const query = 'Electronic';
    const products = await scrapeProducts(query);
    res.render('onsearch', { products, query: query });
});
app.get('/Jwellery', async(req, res) => {
    const query = 'jwellery';
    const products = await scrapeProducts(query);
    res.render('onsearch', { products, query: query });
});
app.get('/Beauty', async(req, res) => {
    const query = 'beauty products';
    const products = await scrapeProducts(query);
    res.render('onsearch', { products, query: query });
});


//filter-panel route -->
app.post('/filters', async(req, res) => {
    const { range, clr, brand, rating, disc, originalQuery } = req.body;
    const mergedQuery = `${clr} ${originalQuery} under ${range} ${brand} with rating ${rating}`;
    const products = await scrapeProducts(mergedQuery);
    res.render('onsearch', { products: products, query: originalQuery });
})


//Become a seller route handling -->
app.get('/add-products', (req, res) => {
    res.render('seller');
})
app.use(express.json());





// //API with shuffle products -->

async function scrapeProducts(query) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        const maxProductsPerWebsite = 8;
        const products = [];

        // Amazon scraping
        await page.goto(`https://www.amazon.in/s?k=${query}`, { timeout: 60000 });
        const amazonProducts = await page.evaluate(() => {
            const products = [];
            const items = document.querySelectorAll('.s-result-item');
            for (let i = 0; i < items.length && i < 10; i++) {
                const item = items[i];
                const nameElement = item.querySelector('h2');
                const priceElement = item.querySelector('.a-price');
                const imageElement = item.querySelector('img');
                if (nameElement && priceElement && imageElement) {
                    const name = nameElement.innerText.trim();
                    const price = priceElement.innerText.trim();
                    const image = imageElement.src.trim();
                    const url = item.querySelector('a').href.trim();
                    products.push({ name, price, image, url, platform: 'Amazon' });
                } else {
                    console.log('Amazon: Missing required elements');
                }
            }
            return products;
        });
        products.push(...amazonProducts);

        // Nykaa scraping
        const nykaaProducts = await scrapeNykaaProducts(query);
        products.push(...nykaaProducts);

        // Snapdeal scraping
        const snapdealProducts = await scrapeSnapdealProducts(query);
        products.push(...snapdealProducts);

        // Myntra scraping
        const myntraProducts = await scrapeMyntraProducts(query);
        products.push(...myntraProducts);

        // Shuffle the combined array of products
        shuffleArray(products);

        return products;
    } catch (error) {
        console.error('Error during scraping:', error);
        return []; // Return an empty array if there's an error
    } finally {
        await browser.close();
    }
}

// Function to scrape products from Nykaa
async function scrapeNykaaProducts(query) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(`https://www.nykaa.com/search/result/?q=${query}`, { timeout: 60000 });
        const nykaaProducts = await page.evaluate(() => {
            const products = [];
            const items = document.querySelectorAll('.product-list-box');
            for (let i = 0; i < items.length && i < 10; i++) {
                const item = items[i];
                const nameElement = item.querySelector('.product-name');
                const priceElement = item.querySelector('.post-card__content-price-offer');
                const imageElement = item.querySelector('.product-image img');
                if (nameElement && priceElement && imageElement) {
                    const name = nameElement.innerText.trim();
                    const price = priceElement.innerText.trim();
                    const image = imageElement.src.trim();
                    const url = item.querySelector('a').href.trim();
                    products.push({ name, price, image, url, platform: 'Nykaa' });
                } else {
                    console.log('Nykaa: Missing required elements');
                }
            }
            return products;
        });
        return nykaaProducts;
    } catch (error) {
        console.error('Error during Nykaa scraping:', error);
        return [];
    } finally {
        await browser.close();
    }
}

// Function to scrape products from Snapdeal
async function scrapeSnapdealProducts(query) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(`https://www.snapdeal.com/search?keyword=${query}`, { timeout: 60000 });
        const snapdealProducts = await page.evaluate(() => {
            const products = [];
            const items = document.querySelectorAll('.product-tuple-listing');
            for (let i = 0; i < items.length && i < 10; i++) {
                const item = items[i];
                const nameElement = item.querySelector('.product-title');
                const priceElement = item.querySelector('.product-price');
                const imageElement = item.querySelector('img');
                if (nameElement && priceElement && imageElement) {
                    const name = nameElement.innerText.trim();
                    const price = priceElement.innerText.trim();
                    const image = imageElement.src.trim();
                    const url = item.querySelector('a').href.trim();
                    products.push({ name, price, image, url, platform: 'Snapdeal' });
                } else {
                    console.log('Snapdeal: Missing required elements');
                }
            }
            return products;
        });
        return snapdealProducts;
    } catch (error) {
        console.error('Error during Snapdeal scraping:', error);
        return [];
    } finally {
        await browser.close();
    }
}

// Function to scrape products from Myntra
async function scrapeMyntraProducts(query) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(`https://www.myntra.com/${query}`, { timeout: 60000 });
        const myntraProducts = await page.evaluate(() => {
            const products = [];
            const items = document.querySelectorAll('.product-base');
            for (let i = 0; i < items.length && i < 10; i++) {
                const item = items[i];
                const nameElement = item.querySelector('.product-product');
                const priceElement = item.querySelector('.product-discountedPrice');
                const imageElement = item.querySelector('img');
                if (nameElement && priceElement && imageElement) {
                    const name = nameElement.innerText.trim();
                    const price = priceElement.innerText.trim();
                    const image = imageElement.src.trim();
                    const url = item.querySelector('a').href.trim();
                    products.push({ name, price, image, url, platform: 'Myntra' });
                } else {
                    console.log('Myntra:  Missing required elements');
                }
            }
            return products;
        });
        return myntraProducts;
    } catch (error) {
        console.error('Error during Myntra scraping:', error);
        return [];
    } finally {
        await browser.close();
    }
}

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// async function scrapeProducts(query) {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     try {
//         const maxProductsPerWebsite = 8;
//         const products = [];

//         // Amazon scraping
//         await page.goto(`https://www.amazon.in/s?k=${query}`, { timeout: 60000 });
//         const amazonProducts = await page.evaluate(() => {
//             const products = [];
//             const items = document.querySelectorAll('.s-result-item');
//             for (let i = 0; i < items.length && i < 10; i++) {
//                 const item = items[i];
//                 const nameElement = item.querySelector('h2');
//                 const priceElement = item.querySelector('.a-price');
//                 const imageElement = item.querySelector('img');
//                 if (nameElement && priceElement && imageElement) {
//                     const name = nameElement.innerText.trim();
//                     const price = priceElement.innerText.trim();
//                     const image = imageElement.src.trim();
//                     const url = item.querySelector('a').href.trim();
//                     products.push({ name, price, image, url, platform: 'Amazon' });
//                 } else {
//                     console.log('Amazon: Missing required elements');
//                 }
//             }
//             return products;
//         });
//         products.push(...amazonProducts);

//         // Nykaa scraping
//         const nykaaProducts = await scrapeNykaaProducts(query);
//         products.push(...nykaaProducts);

//         // Snapdeal scraping
//         const snapdealProducts = await scrapeSnapdealProducts(query);
//         products.push(...snapdealProducts);

//         // Myntra scraping
//         const myntraProducts = await scrapeMyntraProducts(query);
//         products.push(...myntraProducts);

//         // Flipkart scraping
//         const flipkartProducts = await scrapeFlipkartProducts(query);
//         products.push(...flipkartProducts);

//         // Shuffle the combined array of products
//         shuffleArray(products);

//         return products;
//     } catch (error) {
//         console.error('Error during scraping:', error);
//         return []; // Return an empty array if there's an error
//     } finally {
//         await browser.close();
//     }
// }

// //scrapping function for Nykaa -->
// async function scrapeNykaaProducts(query) {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     try {
//         await page.goto(`https://www.nykaa.com/search/result/?q=${query}`, { timeout: 60000 });
//         const nykaaProducts = await page.evaluate(() => {
//             const products = [];
//             const items = document.querySelectorAll('.product-list-box');
//             for (let i = 0; i < items.length && i < 10; i++) {
//                 const item = items[i];
//                 const nameElement = item.querySelector('.css-2c00jk') || item.querySelector('.css-1b232qc');
//                 const priceElement = item.querySelector('.css-1w12u2h') || item.querySelector('.css-111m4sv');
//                 const imageElement = item.querySelector('.css-1h1j0y3 img');
//                 const urlElement = item.querySelector('a');
//                 if (nameElement && priceElement && imageElement && urlElement) {
//                     const name = nameElement.innerText.trim();
//                     const price = priceElement.innerText.trim();
//                     const image = imageElement.src.trim();
//                     const url = urlElement.href.trim();
//                     products.push({ name, price, image, url, platform: 'Nykaa' });
//                 } else {
//                     console.log('Nykaa: Missing required elements');
//                 }
//             }
//             return products;
//         });
//         return nykaaProducts;
//     } catch (error) {
//         console.error('Error during Nykaa scraping:', error);
//         return [];
//     } finally {
//         await browser.close();
//     }
// }


// // Function to scrape products from Snapdeal
// async function scrapeSnapdealProducts(query) {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     try {
//         await page.goto(`https://www.snapdeal.com/search?keyword=${query}`, { timeout: 60000 });
//         const snapdealProducts = await page.evaluate(() => {
//             const products = [];
//             const items = document.querySelectorAll('.product-tuple-listing');
//             for (let i = 0; i < items.length && i < 10; i++) {
//                 const item = items[i];
//                 const nameElement = item.querySelector('.product-title');
//                 const priceElement = item.querySelector('.product-price');
//                 const imageElement = item.querySelector('img');
//                 if (nameElement && priceElement && imageElement) {
//                     const name = nameElement.innerText.trim();
//                     const price = priceElement.innerText.trim();
//                     const image = imageElement.src.trim();
//                     const url = item.querySelector('a').href.trim();
//                     products.push({ name, price, image, url, platform: 'Snapdeal' });
//                 } else {
//                     console.log('Snapdeal: Missing required elements');
//                 }
//             }
//             return products;
//         });
//         return snapdealProducts;
//     } catch (error) {
//         console.error('Error during Snapdeal scraping:', error);
//         return [];
//     } finally {
//         await browser.close();
//     }
// }

// // Function to scrape products from Myntra
// async function scrapeMyntraProducts(query) {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     try {
//         await page.goto(`https://www.myntra.com/${query}`, { timeout: 60000 });
//         const myntraProducts = await page.evaluate(() => {
//             const products = [];
//             const items = document.querySelectorAll('.product-base');
//             for (let i = 0; i < items.length && i < 10; i++) {
//                 const item = items[i];
//                 const nameElement = item.querySelector('.product-product');
//                 const priceElement = item.querySelector('.product-discountedPrice');
//                 const imageElement = item.querySelector('img');
//                 if (nameElement && priceElement && imageElement) {
//                     const name = nameElement.innerText.trim();
//                     const price = priceElement.innerText.trim();
//                     const image = imageElement.src.trim();
//                     const url = item.querySelector('a').href.trim();
//                     products.push({ name, price, image, url, platform: 'Myntra' });
//                 } else {
//                     console.log('Myntra:  Missing required elements');
//                 }
//             }
//             return products;
//         });
//         return myntraProducts;
//     } catch (error) {
//         console.error('Error during Myntra scraping:', error);
//         return [];
//     } finally {
//         await browser.close();
//     }
// }

// // Function to scrape products from Flipkart
// async function scrapeFlipkartProducts(query) {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     try {
//         await page.goto(`https://www.flipkart.com/search?q=${query}`, { timeout: 60000 });
//         const flipkartProducts = await page.evaluate(() => {
//             const products = [];
//             const items = document.querySelectorAll('._1AtVbE');

//             items.forEach(item => {
//                 const nameElement = item.querySelector('._4rR01T');
//                 const priceElement = item.querySelector('._30jeq3');
//                 const imageElement = item.querySelector('img._396cs4');
//                 const linkElement = item.querySelector('a._1fQZEK');

//                 if (nameElement && priceElement && imageElement && linkElement) {
//                     const name = nameElement.innerText.trim();
//                     const price = priceElement.innerText.trim();
//                     const image = imageElement.src.trim();
//                     const url = `https://www.flipkart.com${linkElement.getAttribute('href').trim()}`;
//                     products.push({ name, price, image, url, platform: 'Flipkart' });
//                 } else {
//                     console.log('Flipkart: Missing required elements');
//                 }
//             });

//             return products;
//         });
//         return flipkartProducts;
//     } catch (error) {
//         console.error('Error during Flipkart scraping:', error);
//         return [];
//     } finally {
//         await browser.close();
//     }
// }



// // Shuffle array function
// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
// }


(async() => {
    await app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
})();

// Data base working-->
const { ObjectId } = require('mongodb');
const { client } = require('./db'); // Import the MongoDB client

// Route to render home page with products fetched from MongoDB
app.get('/', async(req, res) => {
    try {
        // Connect to the database
        await client.connect();

        // Select the database and collection
        const db = client.db('raghav');
        const productsCollection = db.collection('products');

        // Fetch all products from the collection
        const products = await productsCollection.find().toArray();

        // Render the home page with the fetched products
        res.render('home', { products: products });
    } catch (err) {
        console.error('Failed to fetch products:', err);
        res.status(500).send('An error occurred while fetching products');
    } finally {
        // Close the database connection
        await client.close();
    }
});


//Login signup handling ->-

const bcrypt = require('bcrypt');
const usersCollection = client.db('raghav').collection('users');

const session = require('express-session');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login-signup');
    }
}
app.post('/add-products',isAuthenticated, async(req, res) => {
    
    const { title, description, url, price, po, Country, mobile, ownerinfo } = req.body;

    try {
        // Connect to the database
        await client.connect();
        // Select the database and collection
        const db = client.db('raghav');
        const productsCollection = db.collection('products');
        // const usersCollection = db.collection('user');
        // const userId = req.session.userId;
        // console.log(userId)
        // const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        // if (!userId) {
        
        // }
        // Insert the product into the collection
        await productsCollection.insertOne({ name: title, description: description, price: price[0], url: url, proorg: po, Country: Country, mobilenum: mobile, ownerinfo: ownerinfo });
        res.redirect('/');
    } catch (err) {
        console.error('Failed to add product:', err);
        res.status(500).send('An error occurred while adding the product');
    } finally {
        // Close the database connection
        await client.close();
    }
});
// Login route
app.get('/login-signup', (req, res) => {
    res.render('login'); // Render your login/signup page
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/');
    });
});

// Post request on /login
app.post('/login', async(req, res) => {
    const { uname, pass } = req.body;
    try {
        await client.connect();
        const user = await usersCollection.findOne({ username: uname });
        if (user && bcrypt.compareSync(pass, user.password)) {
            // res.send('Login Successful');
            req.session.userId = user._id;
            const redirectTo = req.session.redirectTo || '/';
            delete req.session.redirectTo;
            res.redirect(redirectTo);
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

//Post request on /sign-up -->
app.post('/sign-up', async(req, res) => {
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
        // req.session.userId = uname._id;
        // const redirectTo = req.session.redirectTo || '/';
        // delete req.session.redirectTo;
        // res.redirect(redirectTo);
        res.send('Signup Successful');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// Product view route
app.get('/view-product/:productId', isAuthenticated, async(req, res) => {
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

//Profile -->
app.get('/account', isAuthenticated, async(req, res) => {
    try {
        await client.connect();
        const userId = req.session.userId;
        const db = client.db('raghav');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).send('user not found');
        }
        res.render('profile', { user });
    } catch (error) {
        console.error(error);
    }
});

const dbName = 'raghav';
// Route to handle adding to cart
app.post('/add-to-cart/:productId', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).send('You need to log in first');
    }
  
    const { productId } = req.params;
    const { productName, productUrl, productPrice } = req.body;
    const db = client.db(dbName);
    const cartCollection = db.collection('cart');
  
    try {
      const userId = req.session.userId;
      const cart = await cartCollection.findOne({ userId });
  
      if (cart) {
        const productIndex = cart.products.findIndex(p => p.productId === productId);
        if (productIndex > -1) {
          cart.products[productIndex].quantity += 1;
        } else {
          cart.products.push({ productId, productName, productUrl, productPrice, quantity: 1 });
        }
        await cartCollection.updateOne({ userId }, { $set: { products: cart.products } });
      } else {
        await cartCollection.insertOne({
          userId,
          products: [{ productId, productName, productUrl, productPrice, quantity: 1 }]
        });
      }
  
      res.status(200).redirect('/cart');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding product to cart');
    }
  });

// Route to display the cart
app.get('/cart', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).send('You need to log in first');
    }
  
    const userId = req.session.userId;
    const db = client.db(dbName);
    const cartCollection = db.collection('cart');
  
    try {
      await client.connect();
      const cart = await cartCollection.findOne({ userId });
      res.render('cart', { cart });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving cart');
    }
  });


//Purchasing routes -->
app.get('/buy-product/:productId', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('You need to log in first');
    }
    const db = client.db('raghav');
    const { productId } = req.params; // Access productId from req.params
    const productCollection = db.collection('products');
    try {
        // Connect to the database
        await client.connect();
        // Find the product by productId
        const product = await productCollection.findOne({ _id:new ObjectId(productId) });
        if (!product) {
            // If product is not found, return 404 error
            return res.status(404).send('Product not found');
        }
        // Render the purchase page with the product data
        res.render('purchase', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving product');
    }  
});

// Route to remove item from cart
app.post('/remove-item', async (req, res) => {
    const { productId } = req.body;
    const userId = req.session.userId; // Assuming you have user sessions
    const db = client.db('raghav');
    const cartCollection = db.collection('cart');
    try {
        await client.connect();
      await cartCollection.updateOne(
        { userId: userId },
        { $pull: { products: { productId: productId } } }
      );
      res.redirect('/cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).send('Internal Server Error');
    }
  });