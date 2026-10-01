import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../application/subscription.service';
import { Plan } from '../../domain/plan.entity';

@Component({
  selector: 'app-plans-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans-page.component.html',
  styleUrl: './plans-page.component.css',
})
export class PlansPageComponent implements OnInit {
  sub = inject(SubscriptionService);
  processingPlanId = signal<number | null>(null);
  confirmedPlanId = signal<number | null>(null);

  ngOnInit() {
    this.sub.loadPlans().subscribe();
    this.sub.loadCurrent().subscribe();
  }

  choose(plan: Plan, method: 'STRIPE' | 'PAYPAL') {
    this.processingPlanId.set(plan.id);
    this.sub.choosePlan(plan.id, method).subscribe(() => {
      this.processingPlanId.set(null);
      this.confirmedPlanId.set(plan.id);
      setTimeout(() => this.confirmedPlanId.set(null), 2500);
    });
  }
}
