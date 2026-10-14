/**
 * Hlavná konfigurácia Angular aplikácie
 * Tu sa nastavujú všetky globálne providery a služby
 * - Routing (navigácia medzi stránkami)
 * - HTTP Client (pre API requesty)
 * - Token Interceptor (automatické pridávanie tokenu do requestov)
 * - Error handling (spracovanie chýb)
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from '../interceptor/token-interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Globálne spracovanie chýb
    provideRouter(routes), // Konfigurácia routingu
    provideHttpClient(
      withInterceptors([tokenInterceptor]) // Token interceptor - pridáva token do každého HTTP requestu
    )
  ]
};
