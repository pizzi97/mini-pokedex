/**
 * Main client bootstrap entry point.
 *
 * Initializes the standalone Angular application by mounting the root AppComponent
 * configured with application-wide providers defined in appConfig.
 */

import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
