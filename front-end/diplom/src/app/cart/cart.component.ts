import { Component } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cart = this.cartService.cart
  constructor(private cartService: CartService) { }

  ngOninit() {
    console.log(this.cart)
  }
}
