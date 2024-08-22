import { Component, OnInit } from '@angular/core';
import { ProductResponse } from '../../interfaces/product.response';
import { ProductService } from '../../service/products/product.service';
import { CartService } from '../../service/carts/cart.service';
import { environment } from '../../environments/environment';
import { CommonModule, NgFor } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-product',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss']
})
export class CartProductComponent implements OnInit {
  totalPrice: number = 0;
  cartItems: { product: ProductResponse; quantity: number }[] = [];
  isLoading: boolean = false;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadCartItems();
    this.updateTotalPrice();
  }

  loadCartItems(): void {
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys()); // chuyển danh sách Id từ MAP cart

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách id
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);

          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }

          return {
            product: product!,
            quantity: cart.get(productId) ?? 0 // Đảm bảo quantity luôn là số
          };
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error('Order Error', 'Order Product',{
          timeOut: 3000,
         });
        console.error("Error fetching product details", err);
      },
    });
    this.isLoading = false;
  }

  removeItem(productId: number): void {
  if(window.confirm("Are you sure you want to delete?")){
    this.isLoading = true;
    this.toastr.info('Remote product cart success', 'Delete Cart',{
      timeOut: 3000,
     });
    this.cartService.removeFromCart(productId);
    this.loadCartItems(); // Cập nhật lại giỏ hàng sau khi xóa sản phẩm
    this.updateTotalPrice(); // Cập nhật lại tổng tiền sau khi xóa sản phẩm
    this.isLoading = false;
  }
  }

  updateTotalPrice(): void {
    this.cartService.getTotalPrice().subscribe((price) => {
      this.totalPrice = price;
    });
  }
}
