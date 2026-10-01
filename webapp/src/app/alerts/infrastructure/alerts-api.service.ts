import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Alert } from '../domain/alert.entity';
import { Recommendation } from '../domain/recommendation.entity';

@Injectable({ providedIn: 'root' })
export class AlertsApiService {
  private http = inject(HttpClient);
  private readonly alertsEndpoint = `${environment.apiBaseUrl}/alerts`;
  private readonly recommendationsEndpoint = `${environment.apiBaseUrl}/recommendations`;

  getAlerts() {
    return this.http.get<Alert[]>(this.alertsEndpoint);
  }

  // CRUD básico del Aggregate Root Alert (alta/edición/baja manual, además de las
  // transiciones de dominio acknowledge/updateDeliveredChannels de abajo).
  create(alert: Partial<Alert>) {
    return this.http.post<Alert>(this.alertsEndpoint, alert);
  }

  // El fake API (angular-in-memory-web-api) no soporta PATCH, solo GET/POST/PUT/DELETE;
  // por eso todos los métodos de escritura reciben el recurso completo y hacen PUT.
  update(id: number, alert: Partial<Alert>) {
    return this.http.put<Alert>(`${this.alertsEndpoint}/${id}`, { ...alert, id });
  }

  delete(id: number) {
    return this.http.delete(`${this.alertsEndpoint}/${id}`);
  }

  acknowledge(alert: Alert) {
    return this.http.put<Alert>(`${this.alertsEndpoint}/${alert.id}`, { ...alert, acknowledged: true });
  }

  // Persiste el resultado de un intento de entrega (AlertDelivered) agregando el canal recién
  // entregado a deliveredChannels; mismo patrón PUT con objeto completo (ver nota arriba).
  updateDeliveredChannels(alert: Alert) {
    return this.http.put<Alert>(`${this.alertsEndpoint}/${alert.id}`, { ...alert });
  }

  getRecommendations() {
    return this.http.get<Recommendation[]>(this.recommendationsEndpoint);
  }
  markApplied(recommendation: Recommendation) {
    return this.http.put<Recommendation>(`${this.recommendationsEndpoint}/${recommendation.id}`, { ...recommendation, applied: true });
  }
}
