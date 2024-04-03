import { Component, OnInit } from '@angular/core';
import { ProductService} from '../product.service';
import { Product} from '../model/product';
import { NgForm } from "@angular/forms";
@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent implements OnInit{
  productId !: number;
  productDescriptionEnglish : string = '';
  
  message!: string;
  products!: Product[];
  constructor(private productService: ProductService) {
  }

  ngOnInit(): void{
  }

  onSearch(form: NgForm) {
    // ID only
    if (form.value.productId && !form.value.productDescriptionEnglish)
      this.getProduct(form.value.productId);
    
    // ID and Description
    if (form.value.productId && form.value.productDescriptionEnglish) {
     this.getProductWithIDandDesc(form.value.productId, form.value.productDescriptionEnglish);
    }

    // Description only
    if (!form.value.productId && form.value.productDescriptionEnglish) {
      this.getProductfromDesc(form.value.productDescriptionEnglish);
    }

    // Empty Field
    if (!form.value.productId && !form.value.productDescriptionEnglish) {
      this.loadProducts();
    }
  }

  getProductfromDesc(descr: string) {
    this.productService.getProductsUsingDesc(descr).subscribe(
      (data) => {
        if (data) {
          this.products = <Product[]>data;
        }
      },
      (error) => console.log("Could not load products.")
    );
  }

  getProductWithIDandDesc(id: number, descr: string) {
    this.productService.getProductsUsingIDandDesc(id, descr).subscribe(
      (data) => {
        if (data) {
          this.products = [];
          this.products.push(<Product>data);
        }
      },
      (error) => console.log("Could not load products.")
    );
  }

  /**
   * Load all Products from API
   * 
   */
  loadProducts() {
    this.productService.getProducts().subscribe((res:any) => {
      console.log(res);
      this.products = <Product[]>res;
    }, (err:any) => {
      console.log(err.error.status);
    });
  }

  getProduct(id: number) {
    this.productService.loadID(id).subscribe(
      (data) => {
        if (data) {
          this.products = [];
          this.products.push(<Product>data);
        } else {
          this.products = [];
        }
      },
      (error) => console.log("Could not load product.")
    );
  }
}
