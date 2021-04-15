import { ShoppingCartService } from './../shopping-cart.service';
import { Product } from './../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../product.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
// import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy  {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  subscription: Subscription;
  cart: any;

  constructor(
    private route: ActivatedRoute, private productService: ProductService, private cartService: ShoppingCartService
  ) {
    productService
      .getAll()
      .switchMap((products: Product[]) => {
        this.products = products;
        return route.queryParamMap;
      })
      .subscribe(params => {
        this.category = params.get('category');
        this.filteredProducts = (this.category) ? 
          this.products.filter(p => p.category === this.category) : 
          this.products;
      });
  }

  async ngOnInit() {
    this.subscription = (await this.cartService.getCart()).subscribe(cart => this.cart = cart);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
