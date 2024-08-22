import { Routes } from '@angular/router';
import { HomepageComponent } from './page/homepage/homepage.component';
import { HomeComponent } from './layout/home/home.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { CartProductComponent} from './components/cart-product/cart-product.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TestToastComponent } from './components/test-toast/test-toast.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';

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
        path: 'product/:id',
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
        path: 'order_detail',
        component: OrderDetailComponent,
      },
      {
        path: "login",
        component: LoginComponent,
      },{
        path:"register",
        component:RegisterComponent
      },
      {
        path:"test",
        component:TestToastComponent
      }

    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },

];
