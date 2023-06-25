import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { HeaderComponent } from './header/header.component';
import { AdminComponent } from './admin/admin.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  {path:'product', component: ProductsComponent},
  {path:'product/:id', component: ProductPageComponent},
  {path:'admin', component: AdminComponent},
  {path:'cart', component: CartComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
