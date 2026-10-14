/**
 * Definícia všetkých route (ciest/URL) v aplikácii
 * Určuje, ktorá stránka sa zobrazí pri ktorej URL adrese
 *
 * Routes:
 * - '' (root) -> LandingPage (úvodná stránka)
 * - 'login' -> LoginPage (prihlasovacia stránka)
 * - 'dashboard' -> DashboardPage (hlavná stránka s poznámkami, chránená AuthGuard-om)
 *
 * AuthGuard zabezpečuje, že na dashboard sa dostanú len prihlásení používatelia
 */
import { Routes } from '@angular/router';
import { LandingPage } from '../pages/landing-page/landing-page';
import { LoginPage } from '../pages/login-page/login-page';
import { AuthGuard } from '../services/auth-guard';
import { DashboardPage } from '../pages/dashboard-page/dashboard-page';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginPage },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [AuthGuard], // Chránené - vyžaduje prihlásenie
  },
];
