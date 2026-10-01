import { Injectable, inject, signal, computed } from '@angular/core';
import { tap } from 'rxjs';
import { ForecastApiService } from '../infrastructure/forecast-api.service';
import { DemandForecast } from '../domain/demand-forecast.entity';

const DISHES = ['Pizza Margarita', 'Lomo Saltado', 'Ensalada César', 'Pollo a la Brasa'];
const WEATHER = ['Soleado', 'Nublado', 'Lluvia ligera'];
const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

@Injectable({ providedIn: 'root' })
export class ForecastService {
  private api = inject(ForecastApiService);

  readonly forecasts = signal<DemandForecast[]>([]);
  readonly latest = computed(() => this.forecasts().at(-1) ?? null);

  load() {
    return this.api.getAll().pipe(
      tap((forecasts) => this.forecasts.set(forecasts.map((f) => DemandForecast.fromJson(f)))),
    );
  }

  /**
   * Simula el Domain Service `ForecastGenerationService` (Capítulo IV, 4.6.5): genera una
   * nueva proyección de 7 días con sus Value Objects `ConfidenceScore` y `WeatherCondition`.
   *
   * IMPORTANTE — esto es una simulación de datos aleatorios porque en este Sprint no existe
   * un backend real de Machine Learning. Según el modelo de dominio ya formalizado,
   * `ForecastGenerationService` debería combinar el histórico real de ventas (evento
   * `SaleRegistered`, agregado `Sale`) del Bounded Context Sales/Order Management con
   * variables climáticas externas para producir cada `DemandForecast`. En Sprint 2, cuando
   * exista un backend real, este método debe reemplazar la generación aleatoria por una
   * llamada que consuma ese histórico de `Sale` (hoy en desarrollo en paralelo en
   * `src/app/sales-order/`) en vez de `Math.random()`. No se integra aquí todavía para
   * evitar conflictos de archivos con ese trabajo en curso.
   */
  generate() {
    const dataPoints = DAY_LABELS.map((label, idx) => {
      const date = new Date(Date.now() + idx * 86400000).toISOString().slice(0, 10);
      return {
        date,
        dayLabel: label,
        dishName: DISHES[idx % DISHES.length],
        projectedUnits: Math.round(20 + Math.random() * 60),
      };
    });
    const payload: Partial<DemandForecast> = {
      generatedAt: new Date().toISOString(),
      confidenceScore: Number((0.7 + Math.random() * 0.25).toFixed(2)),
      weatherCondition: WEATHER[Math.floor(Math.random() * WEATHER.length)],
      dataPoints,
    };
    return this.api.create(payload).pipe(tap(() => this.load().subscribe()));
  }
}
