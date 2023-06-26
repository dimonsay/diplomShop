import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: { product: Product, count: number }[] = [];

  constructor(private cartService: CartService, private productService: ProductsService) { }

  ngOnInit() {
    this.getCart();
  }

  getCart() {
    this.cartService.getCart().subscribe(
      data => {
        this.cart = data;
      },
      error => {
        console.error('Ошибка при получении данных:', error);
      }
    );
  }

  increaseCount(productId: number, count: number = 1) {
    this.cartService.countChange(productId, count)
    this.getCart();
  }
  decreaseCount(productId: number, count: number = -1) {
    this.cartService.countChange(productId, count)
    this.getCart();
  }
}
