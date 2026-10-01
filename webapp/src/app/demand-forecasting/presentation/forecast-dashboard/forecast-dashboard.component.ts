import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastService } from '../../application/forecast.service';

@Component({
  selector: 'app-forecast-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast-dashboard.component.html',
  styleUrl: './forecast-dashboard.component.css',
})
export class ForecastDashboardComponent implements OnInit {
  forecast = inject(ForecastService);
  generating = signal(false);

  maxUnits = computed(() => Math.max(1, ...this.forecast.latest()?.dataPoints.map((d) => d.projectedUnits) ?? [1]));

  ngOnInit() {
    this.forecast.load().subscribe();
  }

  barHeight(units: number) {
    return `${Math.max(8, (units / this.maxUnits()) * 160)}px`;
  }

  generate() {
    this.generating.set(true);
    this.forecast.generate().subscribe(() => this.generating.set(false));
  }
}
