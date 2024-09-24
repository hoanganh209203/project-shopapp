import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import uk from '@angular/common/locales/uk';
import { ApplicationConfig } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { tokenInterceptor } from './interceptors/tokens/token.interceptor';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

registerLocaleData(uk);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: tokenInterceptor, multi: true },
    provideAnimations(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    provideToastr(),
  ],
};
