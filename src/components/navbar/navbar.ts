/**
 * Navbar - Horné navigačné menu
 * Zobrazuje sa v dashboarde
 * Obsahuje tlačidlo na odhlásenie (logout)
 *
 * Po kliknutí na logout:
 * 1. Zavolá logout v UserManagement (zmaže token)
 * 2. Presmeruje používateľa na úvodnú stránku (/)
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { UserManagement } from '../../services/user-management';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { DashboardService } from '../../services/dashboard-service';

@Component({
  selector: 'app-navbar',
  imports: [MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  userService = inject(UserManagement);
  dashboardService = inject(DashboardService);
  router = inject(Router);

  ngOnInit(): void {
    if (this.isLoggedIn()) {
    }
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  logout(): void {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
