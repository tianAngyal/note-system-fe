/**
 * AuthGuard - Ochrana route/ciest
 * Zabezpečuje, že na chránené stránky (napr. dashboard) sa dostanú len prihlásení používatelia
 * 
 * Princíp:
 * 1. Skontroluje, či má používateľ token (či je prihlásený)
 * 2. Ak ÁNO -> pustí ho na stránku (return true)
 * 3. Ak NIE -> presmeruje ho na /login a nepustí ho (return false)
 */
import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserManagement } from './user-management';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  userService = inject(UserManagement);
  router = inject(Router);

  canActivate(): boolean {
    const isAuthenticated = this.userService.isLoggedIn();
    if (!isAuthenticated) {
      // Ak nie je prihlásený, presmeruj na login
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
