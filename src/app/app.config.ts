import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Material components (mat-tab-group) require an animation provider.
    provideAnimationsAsync(),
    // withComponentInputBinding() maps route params (e.g. :id) to component
    // inputs so the diagram-agent viewer can declare `id = input<string>()`.
    provideRouter(routes, withComponentInputBinding()),
  ]
};
