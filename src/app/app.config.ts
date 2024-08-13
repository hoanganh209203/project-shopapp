import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/tokens/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),provideClientHydration(),provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: tokenInterceptor, multi: true }
  ]
};
