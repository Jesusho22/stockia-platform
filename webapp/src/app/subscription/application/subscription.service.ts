import { Injectable, inject, signal, computed } from '@angular/core';
import { tap, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SubscriptionApiService } from '../infrastructure/subscription-api.service';
import { Plan, Subscription } from '../domain/plan.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private api = inject(SubscriptionApiService);
  private http = inject(HttpClient);

  readonly plans = signal<Plan[]>([]);
  readonly current = signal<Subscription | null>(null);
  readonly currentPlan = computed(() => this.plans().find((p) => p.id === this.current()?.planId) ?? null);

  loadPlans() {
    return this.api.getPlans().pipe(tap((plans) => this.plans.set(plans.map((p) => Plan.fromJson(p)))));
  }

  loadCurrent() {
    return this.api.getCurrent().pipe(
      tap((subs) => this.current.set(subs.length ? Subscription.fromJson(subs[0]) : null)),
    );
  }

  /** Simula el checkout con Stripe/PayPal (US31) — no procesa pagos reales. */
  choosePlan(planId: number, paymentMethod: 'STRIPE' | 'PAYPAL') {
    const existing = this.current();
    const payload = {
      planId,
      paymentMethod,
      status: 'ACTIVE',
      renewalDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    };
    const request$ = existing
      ? this.http.put(`${environment.apiBaseUrl}/subscriptions/${existing.id}`, { ...payload, id: existing.id })
      : this.api.subscribeTo(planId, paymentMethod);

    return request$.pipe(switchMap(() => this.loadCurrent()));
  }
}
