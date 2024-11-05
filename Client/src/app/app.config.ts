import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { BaseRouteReuseStrategy, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { provideSpinnerConfig } from 'ngx-spinner';
import { TimeagoModule } from 'ngx-timeago';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

export const appConfig: ApplicationConfig = {
  providers:
  [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])),
    provideAnimations(), provideSpinnerConfig({type:'ball-scale-multiple'}),
    provideToastr({ timeOut:2000, positionClass:'toast-bottom-right', preventDuplicates:true}),
    importProvidersFrom(TimeagoModule.forRoot(), ModalModule.forRoot(), BsModalService)
  ]
};
