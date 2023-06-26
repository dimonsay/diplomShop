"use strict";

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;
const www = process.env.WWW || './';
const cors = require('cors');

app.use(cors());
app.use(express.static("public"));
console.log(`serving ${www}`);

let bodyParser = require('body-parser');
app.use(bodyParser.json());



//allow cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

const productsData = fs.readFileSync('products.json');
let products = JSON.parse(productsData);


//get product by id 
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const product = products.find(product => product.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  res.json(product);
})

//add new product
app.post('/admin', (req, res) => {

  const { name, price, description, size, season, material, color, imageURL } = req.body;

  const maxId = Math.max(...products.map(product => product.id));
  let newProductId = maxId + 1;

  const newProduct = {
    id: newProductId,
    name: name,
    price: price,
    description: description,
    size: size,
    season: season,
    material: material,
    color: color,
    imageURL: imageURL,
  };


  products.push(newProduct);
  fs.writeFileSync('products.json', JSON.stringify(products));
  res.json({ message: 'Товар успешно добавлен', product: newProduct });
})

//product delete
app.post('/deleteProduct', (req, res) => {
  const id = req.body.id;

  // Read the products.json file
  fs.readFile('products.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading products.json');
      return;
    }

    let products;
    try {
      products = JSON.parse(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to parse products.json' });
      return;
    }

    products = products.filter(product => product.id !== id);

    fs.writeFile('products.json', JSON.stringify(products), (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to update products.json' });
        return;
      }

      res.status(200).json({ message: 'Product deleted successfully' });
    });
  });
});

//add product to cart 
app.post('/addToCart', async (req, res) => {
  const { product } = req.body;

  try {
    const cartData = await fs.promises.readFile('cart.json', 'utf8');
    let cartItems = JSON.parse(cartData);

    if (!Array.isArray(cartItems)) {
      cartItems = []; // Если cartItems не является массивом, инициализируем его как пустой массив
    }

    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.count += 1; // Увеличиваем количество существующего товара на 1
    } else {
      const newProduct = { product, count: 1 };
      cartItems.push(newProduct); // Добавляем новый товар в корзину со значением count равным 1
    }

    await fs.promises.writeFile('cart.json', JSON.stringify(cartItems), 'utf8');
    res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error manipulating cart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//get cart
app.get('/cart', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'cart.json');
    const cartData = await fs.promises.readFile(filePath, 'utf8');
    const cartItems = JSON.parse(cartData);
    res.json(cartItems);
  } catch (error) {
    console.error('Error reading cart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/changeCountInCart', (req, res) => {
  const { productId, count } = req.body;

  fs.readFile('cart.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read cart data' });
    }

    let cart;

    try {
      cart = JSON.parse(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to parse cart data' });
    }

    // Find the product in the cart
    const product = cart.find((item) => item.product.id === productId);

    if (product) {
      // Update the count of the existing product
      console.log(product.count)
      product.count += count;
      
    }

    // Write the updated cart data back to the file
    fs.writeFile('cart.json', JSON.stringify(cart), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to write cart data' });
      }
      res.status(200).json({ message: 'Count in cart updated successfully' });
    });
  });
});

//get all products
app.get('/products', (req, res) => {
  const filePath = path.join(__dirname, 'products.json');
  res.sendFile(filePath); 
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
