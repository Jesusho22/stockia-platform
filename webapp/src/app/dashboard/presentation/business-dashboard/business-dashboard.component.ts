import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../product-inventory/application/inventory.service';
import { AlertsService } from '../../../alerts/application/alerts.service';
import { ForecastService } from '../../../demand-forecasting/application/forecast.service';
import { AuthService } from '../../../iam/application/auth.service';
import { StockStatus, STOCK_STATUS_LABEL } from '../../../product-inventory/domain/inventory-item.entity';

// Vista del Bounded Context Dashboard & Analytics (US21): agrega datos de
// Inventory & Recipe Management, Alerts & Recommendations y Demand Forecasting
// a través de identidad (ids), nunca accediendo directo a sus repositorios.
@Component({
  selector: 'app-business-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-dashboard.component.html',
  styleUrl: './business-dashboard.component.css',
})
export class BusinessDashboardComponent implements OnInit {
  inventory = inject(InventoryService);
  alertsSrv = inject(AlertsService);
  forecast = inject(ForecastService);
  auth = inject(AuthService);

  statusLabel = STOCK_STATUS_LABEL;
  StockStatus = StockStatus;

  ngOnInit() {
    this.inventory.loadItems().subscribe();
    this.alertsSrv.loadAlerts().subscribe();
    this.forecast.load().subscribe();
  }

  get criticalItems() {
    return this.inventory.items().filter(
      (i) => i.status === StockStatus.CRITICAL || i.status === StockStatus.LOW || i.status === StockStatus.EXPIRED,
    );
  }
}
