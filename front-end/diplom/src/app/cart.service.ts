import { Injectable } from '@angular/core';
import { Product } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: {product:Product[], count:number}[] = []

  addToCart(product:Product[], count:number = 1){
    if(this.cart.some(item=>item.product===product)){
      this.cart.some(item=>item.count+=1)
    } else{
      let newProduct = {product, count:count}
      this.cart.push(newProduct)
    }
  }

  countChange(id:number,count:number){
    
  }

  getCart(){
    return this.cart;
  }
}
