/**
 * LandingPage - Úvodná stránka aplikácie
 * Prvá stránka, ktorú používateľ vidí po otvorení aplikácie (URL: /)
 * Obsahuje welcome správu a tlačidlo na prechod na login stránku
 */
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {}
