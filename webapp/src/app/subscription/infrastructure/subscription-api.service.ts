import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Plan, Subscription } from '../domain/plan.entity';

@Injectable({ providedIn: 'root' })
export class SubscriptionApiService {
  private http = inject(HttpClient);
  private readonly plansEndpoint = `${environment.apiBaseUrl}/plans`;
  private readonly subscriptionsEndpoint = `${environment.apiBaseUrl}/subscriptions`;

  getPlans() {
    return this.http.get<Plan[]>(this.plansEndpoint);
  }
  getCurrent() {
    return this.http.get<Subscription[]>(this.subscriptionsEndpoint);
  }
  subscribeTo(planId: number, paymentMethod: 'STRIPE' | 'PAYPAL') {
    return this.http.post<Subscription>(this.subscriptionsEndpoint, {
      planId,
      paymentMethod,
      status: 'ACTIVE',
      renewalDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    });
  }
}
