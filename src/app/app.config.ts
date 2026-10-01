/**
 * Root application configuration provider.
 *
 * Configures core platform dependencies for the standalone Angular application,
 * enabling optimized zone change detection with event coalescing, client-side
 * routing based on application route definitions, and the global HttpClient module.
 */

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
