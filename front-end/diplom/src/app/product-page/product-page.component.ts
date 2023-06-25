import { Component } from '@angular/core';
import { Product, ProductsService } from '../products.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent {
  
  product: Product = {} as Product;
  
  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.productService.getProductById(productId).subscribe(product => {
        this.product = product;
        console.log(this.product);
      });
    });
    console.log(this.cartService.getCart());
  }

  addToCart(product: any, count : number = 1){
    this.cartService.addToCart(product, count)
  }

}
