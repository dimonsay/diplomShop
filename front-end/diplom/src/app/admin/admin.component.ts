import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  @ViewChild('productForm', { static: false }) productForm!: NgForm;

  constructor(private http: HttpClient, private productService: ProductsService) { }
  
  product: any = {};
  products: any[] = [];
 
  
  addProduct() {
    const productJson = JSON.stringify(this.product);
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post<any>('http://localhost:3000/admin', productJson, httpOptions)
      .subscribe(
        response => {
          console.log(response); // Обробка відповіді
          this.products.push(response); // Додавання товару до списку
          this.getProducts();
        },
        error => {
          console.error(error); // Обробка помилок
        }
      );
        
      
    this.productForm.resetForm();
  };

  ngOnInit() {
    this.getProducts();
  
  };
  
  getProducts() {
    fetch('http://localhost:3000/products')
      .then(response => response.json())
      .then(data => {
        this.products = data;
        console.log(this.products);
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  }
  removeProduct(product: number) {
    const body = {id : product}
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post<any>('http://localhost:3000/deleteProduct', body, httpOptions)
      .subscribe(
        response => {
          console.log(response); 
          // this.products.push(response); 
          this.getProducts();
        },
        error => {
          console.error(error); 
        }
      );

    // console.log(product)
  }

  isImageLoaded: boolean = true;

  checkImageURL() {
    const img = new Image();
    img.src = this.product.imageURL;
    img.onload = () => {
     this.addProduct();
    };
    img.onerror = () => {
      return false;
      console.log('Не удалось загрузить изображение. Проверьте ссылку.');
    };
  }
}