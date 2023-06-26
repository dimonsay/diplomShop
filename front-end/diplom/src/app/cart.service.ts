import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, throwError } from 'rxjs';
import { ProductsService, Product } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http: HttpClient, private productsService: ProductsService) {
    this.getCart(); // Fetch initial cart data
  }

  getCart(): Observable<{ product: Product; count: number; }[]> {
    const url = 'http://localhost:3000/cart';
    return this.http.get<{ product: Product; count: number; }[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching cart data:', error);
        return throwError(error);
      })
    );
  }
  

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

  countChange(productId: number, count: number): void {
    const url = 'http://localhost:3000/changeCountInCart';
    const requestBody = { productId, count };
    this.http.post<any>(url, requestBody).subscribe(
      response => {
        
      },
      error => {
        console.error('Error changing count in cart:', error);
      }
    );
  }

}
