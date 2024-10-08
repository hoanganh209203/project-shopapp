import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductResponse } from '../../../interfaces/product.response';
import { CartService } from '../../../service/carts/cart.service';
import { ProductService } from '../../../service/products/product.service';
import { OrderService } from '../../../service/orders/order.service';
import { OrderType } from '../../../dtos/orders/orders.dto';
import { environment } from '../../../environments/environment';
import { CommonModule, NgFor } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [FormsModule, NgFor, CommonModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  orderForm!: FormGroup;
  cartItems: { product: ProductResponse; quantity: number }[] = [];
  couponCode: string = ''; //Mã giảm giá
  totalAmont: number = 0;
  orderData: OrderType = {
    user_id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_address: '',
    shipping_method: 'express',
    coupon_code: '',
    cart_items: [],
  };
  totalPrice: number = 0;
  isLoading: boolean = false;
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.buildForm();
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.orderData.user_id = user.id;
    }
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());
    this.calculateTotal();
    if (productIds.length === 0) {
      return;
    }
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        this.cartItems = productIds.map((productId: any) => {
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: cart.get(productId)!,
          };
        });
        this.calculateTotal();
        this.isLoading = false;
      },
      complete() {
        console.log(123);
      },
      error: (err) => {
        this.toastr.error('Error fetching product details', err, {
          timeOut: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  buildForm() {
    this.orderForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(9)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      note: [''],
      shipping_address: '',
      shipping_method: ['express'],
      payment_method: ['cod'],
    });
  }

  placeOrder() {
    if (this.orderForm.valid) {
      // Chuyển đổi các mục trong giỏ hàng thành định dạng phù hợp cho order_detail
      const cartItems = this.cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value,
        total_money: this.totalPrice,
        cart_items: cartItems, // Cập nhật các mục trong giỏ hàng vào orderData
      };

      this.orderService.createOrder(this.orderData).subscribe({
        next: (response: any) => {
          this.isLoading = true;
          const orderId = response.id;
          this.toastr.success('Order Products Successfully', 'Order Product', {
            timeOut: 3000,
          });
          this.router.navigate([`/order_detail/${orderId}`]);
          this.isLoading = false;
        },

        complete: () => {
          this.calculateTotal();
        },

        error: (err) => {
          this.toastr.error('Error fetching product details', err, {
            timeOut: 3000,
          });
        },
      });
    } else {
      this.toastr.error(
        'Dữ liệu không hợp lệ vui lòng kiểm tra lại',
        'Order Error',
        {
          timeOut: 3000,
        }
      );
    }
  }

  //Hàm tính tổng tiền
  calculateTotal(): void {
    this.cartService.getTotalPrice().subscribe((price) => {
      this.totalPrice = price;
    });
  }

  //Hàm áp mã giảm giá
  applyCoupon(): void {}

  // routerHome(){
  //   this.router.navigate()
  // }
}
