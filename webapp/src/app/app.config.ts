import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { routes } from './app.routes';
import { InMemoryDataService } from './fake-api/in-memory-data.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    // Fake API en memoria — ver src/app/fake-api/in-memory-data.service.ts.
    // Delay simulado para que los estados "Cargando…" sean visibles en demo.
    ...(environment.useFakeApi
      ? [
          importProvidersFrom(
            HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
              apiBase: 'api/v1/',
              delay: 250,
              passThruUnknownUrl: true,
            }),
          ),
        ]
      : []),
  ],
};
