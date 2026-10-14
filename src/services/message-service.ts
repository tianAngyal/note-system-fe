/**
 * MessageService
 * Zabezpečuje zobrazovanie notifikácií (správ) používateľovi
 * Používa Material Snackbar - malé popup okienko v rohu obrazovky
 * 
 * Typy správ:
 * - Info správy (zelené) - úspešné akcie
 * - Error správy (červené) - chyby a problémy
 */
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private snackBar = inject(MatSnackBar);

  /**
   * Zobrazí chybovú správu (červenú)
   * Používa sa pri chybách (napr. zlé heslo, server nedostupný)
   */
  public printError(msg: string, duration = 3000) {
    this.snackBar.open(msg, 'ERROR', {
      duration,
      panelClass: 'errorbutton',
    });
  }

  /**
   * Zobrazí info správu (zelenú)
   * Používa sa pri úspešných akciách (napr. úspešné prihlásenie)
   */
  public printInfo(msg: string, duration = 3000) {
    this.snackBar.open(msg, 'INFO', {
      duration,
    });
  }
}
