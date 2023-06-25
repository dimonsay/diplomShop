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

app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const product = products.find(product => product.id === id);

    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    console.log(products, req.body, id)
    res.json(product);
})


app.post('/admin', (req, res) => {

    const { name, price, description, size, season, material, color, imageURL } = req.body;

    const maxId = Math.max(...products.map(product => product.id));
    let newProductId = maxId+1;

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
      
    console.log(newProduct)

    products.push(newProduct);
    fs.writeFileSync('products.json', JSON.stringify(products));
    res.json({ message: 'Товар успешно добавлен', product: newProduct });
})

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
  
      // Filter the products array to exclude the item with the matching ID
      products = products.filter(product => product.id !== id);
  
      // Write the updated data back to the file
      fs.writeFile('products.json', JSON.stringify(products), (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to update products.json' });
          return;
        }
  
        res.status(200).json({ message: 'Product deleted successfully' });
      });
    });
  });

app.get('/products', (req, res) => {
    const filePath = path.join(__dirname, 'products.json');
    res.sendFile(filePath); const fs = require('fs');
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
