/**
 * Hlavný root komponent aplikácie
 * Slúži ako kontajner pre celú Angular aplikáciu
 * RouterOutlet tu zabezpečuje rendering rôznych stránok podľa URL
 */
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Názov aplikácie
  protected readonly title = signal('client');
}
