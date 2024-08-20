import { ApplicationConfig, importProvidersFrom, NgModule } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/tokens/token.interceptor';

import { registerLocaleData } from '@angular/common';
import uk from '@angular/common/locales/uk';
import { FormsModule, NgModel } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



registerLocaleData(uk);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideClientHydration(),
    provideAnimations(),
    NgModel,
    NgModule,
    { provide: HTTP_INTERCEPTORS, useClass: tokenInterceptor, multi: true },
    importProvidersFrom(FormsModule,NgModel), // Import các module của NG-ZORRO cần thiết
    provideAnimationsAsync()
  ]
};
