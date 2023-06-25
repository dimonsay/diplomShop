import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsService, Product } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http:HttpClient, private productsService:ProductsService){}

  cart: {product:Product[], count:number}[] = []

  addToCart(product: Product, count: number): void {
    const url = 'http://localhost:3000/addToCart';
    const requestBody = { product, count };
  
    this.http.post(url, requestBody).subscribe(
      () => {
        this.getCart();
      },
      error => {
        console.error('Error adding product to cart:', error);
      }
    );
  }
  
  getCart(): Observable<{ product: Product; count: number }[]> {
    const url = 'http://localhost:3000/cart';
    return this.http.get<{ product: Product; count: number }[]>(url);
  }
  
  

  countChange(id:number,count:number){
    
  }
}
