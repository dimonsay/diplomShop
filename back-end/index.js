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

//get cart
app.get('/cart', (req, res) => {
  const filePath = path.join(__dirname, 'cart.json');
  res.sendFile(filePath); 
});


//add product to cart 
app.post('/addToCart', (req, res) => {
  const { product } = req.body;

  fs.readFile('cart.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading cart.json:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    let cartItems;
    try {
      cartItems = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing cart.json:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

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

    fs.writeFile('cart.json', JSON.stringify(cartItems), 'utf8', err => {
      if (err) {
        console.error('Error writing to cart.json:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.status(200).json({ message: 'Product added to cart' });
    });
  });
});

//get all products
app.get('/products', (req, res) => {
  const filePath = path.join(__dirname, 'products.json');
  res.sendFile(filePath); 
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
