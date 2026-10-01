import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './iam/infrastructure/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/sign-in' },
  {
    path: 'auth/sign-in',
    loadComponent: () => import('./iam/presentation/sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: 'auth/sign-up',
    loadComponent: () => import('./iam/presentation/sign-up/sign-up.component').then((m) => m.SignUpComponent),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/presentation/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/presentation/business-dashboard/business-dashboard.component').then((m) => m.BusinessDashboardComponent),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./product-inventory/presentation/inventory-list/inventory-list.component').then((m) => m.InventoryListComponent),
      },
      {
        path: 'recipes',
        loadComponent: () =>
          import('./product-inventory/presentation/recipe-list/recipe-list.component').then((m) => m.RecipeListComponent),
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./sales-order/presentation/sales-history/sales-history.component').then((m) => m.SalesHistoryComponent),
      },
      {
        path: 'forecast',
        loadComponent: () =>
          import('./demand-forecasting/presentation/forecast-dashboard/forecast-dashboard.component').then((m) => m.ForecastDashboardComponent),
      },
      {
        path: 'alerts',
        loadComponent: () => import('./alerts/presentation/alerts-list/alerts-list.component').then((m) => m.AlertsListComponent),
      },
      {
        path: 'recommendations',
        loadComponent: () =>
          import('./alerts/presentation/recommendations-list/recommendations-list.component').then((m) => m.RecommendationsListComponent),
      },
      {
        path: 'roles',
        canActivate: [adminGuard],
        loadComponent: () => import('./iam/presentation/roles-list/roles-list.component').then((m) => m.RolesListComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./iam/presentation/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'plans',
        loadComponent: () => import('./subscription/presentation/plans-page/plans-page.component').then((m) => m.PlansPageComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'auth/sign-in' },
];
