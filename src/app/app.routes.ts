import { Routes } from '@angular/router';
import { HomepageComponent } from './page/homepage/homepage.component';
import { HomeComponent } from './layout/home/home.component';
import { DetailProductComponent } from './components/clients/detail-product/detail-product.component';
import { CartProductComponent } from './components/clients/cart-product/cart-product.component';
import { OrderComponent } from './components/orders/order/order.component';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TestToastComponent } from './components/test-toast/test-toast.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';
import { ShowCategoryComponent } from './components/clients/show-category/show-category.component';
import { OrderUserIdComponent } from './components/orders/order-user-id/order-user-id.component';
import { CategoryPageComponent } from './components/clients/category-page/category-page.component';
import { ProductByCategoryComponent } from './components/clients/product-by-category/product-by-category.component';
import { AdminComponent } from './layout/admin/admin.component';
import { ProductsComponent } from './components/admins/products-admin/products/products.component';
import { ProductShopComponent } from './components/clients/products/products.component';
import { CategoriesAdminComponent } from './components/admins/categories-admin/categories/categories.component';
import { AdminsComponent } from './page/admins/admins.component';
import { CreateProductComponent } from './components/admins/products-admin/create-product/create-product.component';
import { UpdateProductComponent } from './components/admins/products-admin/update-product/update-product.component';
import { SoftDeletedListComponent } from './components/admins/products-admin/soft-deleted-list/soft-deleted-list.component';
import { CreateCategoryComponent } from './components/admins/categories-admin/create-category/create-category.component';
import { UpdateCategoryComponent } from './components/admins/categories-admin/update-category/update-category.component';
import { UserListComponent } from './components/admins/user-admin/user-list/user-list.component';
import { authGuard } from './guards/auth.guard';
import { OrderListComponent } from './components/admins/orders-admin/order-list/order-list.component';
import { OrderDetailAdminComponent } from './components/admins/orders-admin/order-detail-admin/order-detail-admin.component';
import { OrderStatisticsComponent } from './components/orders/order-statistics/order-statistics.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomepageComponent,
      },
      {
        path: 'shop',
        component: ProductShopComponent,
      },

      {
        path: 'products/:id',
        component: DetailProductComponent,
      },

      {
        path: 'cart',
        component: CartProductComponent,
      },
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'order_detail/:id',
        component: OrderDetailComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'order_user/:id',
        component: OrderUserIdComponent,
      },
      {
        path: 'categories',
        component: CategoryPageComponent,
      },
      {
        path: 'product_by_cate/:id',
        component: ProductByCategoryComponent,
      },
      {
        path: 'test',
        component: ShowCategoryComponent,
      },
    ],
  },
  // {
  //   path: '**',
  //   component: NotFoundComponent,
  // },
  {
    path: 'admin',
    canActivate: [authGuard],
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: AdminsComponent,
      },
      {
        path: 'thong-ke',
        component: OrderStatisticsComponent,
      },
      //admin products
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'add-product',
        component: CreateProductComponent,
      },
      {
        path: 'up-product/:id',
        component: UpdateProductComponent,
      },
      {
        path: 'list-soft-deleted',
        component: SoftDeletedListComponent,
      },
      // admin Category
      {
        path: 'category',
        component: CategoriesAdminComponent,
      },
      {
        path: 'add-category',
        component: CreateCategoryComponent,
      },
      {
        path: 'update-category/:id',
        component: UpdateCategoryComponent,
      },
      //User admin
      {
        path: 'list-user',
        component: UserListComponent,
      },
      //Order admin
      {
        path: 'order-list',
        component: OrderListComponent,
      },
      {
        path: 'order-detail-admin/:id',
        component: OrderDetailAdminComponent,
      },
    ],
  },
];
