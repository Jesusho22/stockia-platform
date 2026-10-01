import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DemandForecast } from '../domain/demand-forecast.entity';

@Injectable({ providedIn: 'root' })
export class ForecastApiService {
  private http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/demandForecasts`;

  getAll() {
    return this.http.get<DemandForecast[]>(this.endpoint);
  }

  create(forecast: Partial<DemandForecast>) {
    return this.http.post<DemandForecast>(this.endpoint, forecast);
  }
}
