import { Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderProductComponent } from './components/order-product/order-product.component';
import { OrderComponent } from './components/order/order.component';
import { HomepageComponent } from './page/homepage/homepage.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';

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
        path: 'detail/:idPr',
        component: DetailProductComponent,
      },
      {
        path: 'order_detail/:idPr',
        component: OrderProductComponent,
      },
      {
        path: 'order/:idPr',
        component: OrderComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
