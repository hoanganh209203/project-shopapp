import { Routes } from '@angular/router';
import { HomepageComponent } from './page/homepage/homepage.component';
import { HomeComponent } from './layout/home/home.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderProductComponent } from './components/order-product/order-product.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TestToastComponent } from './components/test-toast/test-toast.component';

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
        path: 'order_confirm/:idPr',
        component: OrderProductComponent,
      },
      {
        path: 'order',
        component: OrderComponent,
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
