import { Component, OnInit } from '@angular/core';
import { ProductResponse } from '../../interfaces/product.response';
import { ProductService } from '../../service/products/product.service';
import { ProductImage } from '../../interfaces/productImage';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { CartService } from '../../service/carts/cart.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [FormsModule, NgClass, NgFor, NgStyle, NgIf, ToastrModule], // Import ToastrModule cho standalone component
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
})
export class DetailProductComponent implements OnInit {
  products?: ProductResponse;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const iParam = 8;
    if (iParam !== null) {
      this.productId = +iParam;
    }

    if (!isNaN(this.productId)) {
      this.productService.productDetail(this.productId).subscribe({
        next: (response: any) => {
          this.isLoading = false; // tắt loading sau khi nhận dữ liệu
          this.toastr.success('Product details loaded successfully'); // Toast thông báo thành công
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              if (!product_image.image_url.startsWith(environment.apiBaseUrl)) {
                product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
              }
            });
          } else {
            this.isLoading = false;
            this.toastr.error('Failed to load product details'); // Toast thông báo lỗi
            console.warn('product_image is not available or is empty');
          }

          this.products = response;
          this.showImage(0);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.toastr.error('Error fetching product details'); // Thêm thông báo lỗi
          console.log('Error fetching detail ', err);
        },
      });
    } else {
      console.log('Invalid productId: ', iParam);
    }
  }

  showImage(index: number) {
    if (this.products?.product_images?.length) {
      if (index < 0) {
        index = 0;
      } else if (index >= this.products.product_images.length) {
        index = this.products.product_images.length - 1;
      }
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {
    this.currentImageIndex = index;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    if (this.products) {
      this.toastr.success('Product added to cart', 'Add To Cart',{
        timeOut: 3000,
       });
      this.cartService.addToCart(this.productId, this.quantity);
    } else {
      this.toastr.error('Unable to add product to cart');
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì products là null');
    }
  }

  buyNow(): void {
    this.toastr.info('Buying now...');
  }
}
