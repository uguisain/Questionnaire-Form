import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(), provideAnimations(),
    {
      provide: MAT_DIALOG_SCROLL_STRATEGY,
      useFactory: (overlay: Overlay) => () => overlay.scrollStrategies.reposition(),
      deps: [Overlay]
    }
  ],
};
