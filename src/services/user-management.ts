/**
 * UserManagement Service
 * Zabezpečuje celú autentifikáciu používateľov
 * - Prihlasovanie (login) - pošle meno a heslo na server, dostane token
 * - Odhlasovanie (logout) - zmaže token
 * - Kontrola prihlásenia (isLoggedIn) - zistí, či má používateľ token
 * - Token sa ukladá do localStorage prehliadača
 */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable, of, tap } from 'rxjs';
import { Auth } from '../entities/auth';
import { MessageService } from './message-service';
import { environment } from '../environment/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserManagement {
  private messageService = inject(MessageService);
  public url = environment.restServer;

  // Getter a setter pre token - ukladá sa do localStorage
  private set token(value: string) {
    if (value) {
      localStorage.setItem('authToken', value);
    } else {
      localStorage.removeItem('authToken');
    }
  }
  private get token() {
    return localStorage.getItem('authToken') || '';
  }
  constructor(private http: HttpClient) {}

  /**
   * Kontrola, či je používateľ prihlásený
   * Skontroluje, či existuje token v localStorage
   */
  isLoggedIn(): boolean {
    return !!this.token;
  }

  /**
   * Prihlásenie používateľa
   * 1. Pošle username a password na server
   * 2. Server vráti token
   * 3. Token sa uloží do localStorage
   * 4. Zobrazí sa success message
   */
  login(auth: Auth): Observable<boolean> {
    return this.http.post(`${this.url}api/auth/login`, auth, { responseType: 'text' }).pipe(
      tap((token) => {
        this.token = token; // Ulož token
      }),
      map((token) => {
        this.messageService.printInfo('Login successfull');
        return true;
      }),
      catchError((err) => this.processErrors(err)),
    );
  }

  /**
   * Odhlásenie používateľa
   * 1. Zavolá logout endpoint na serveri
   * 2. Zmaže token z localStorage
   * 3. Zobrazí sa success message
   */
  logout(): Observable<boolean> {
    return this.http.get(`${this.url}api/auth/logout/${this.token}`).pipe(
      map(() => {
        console.log('Logout successful on server, token removed from client');
        this.token = ''; // Vymaž token
        localStorage.removeItem('authToken');
        this.messageService.printInfo('Logout successfull');
        return true;
      }),
      catchError((err) => {
        this.token = ''; // Vymaž token aj pri chybe
        localStorage.removeItem('authToken');
        this.messageService.printInfo('Logout successfull');
        return of(true);
      }),
    );
  }

  /**
   * Spracovanie chýb z HTTP requestov
   * Zobrazí používateľovi chybovú hlášku pomocou MessageService
   */
  processErrors(err: any): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        const statusCode = err.status;
        const message = `Server is not available. Status code ${statusCode}`;
        this.messageService.printError(message);
        return EMPTY;
      }
      if (err.status >= 400 && err.status < 500) {
        console.log(err);
        let parsed = JSON.parse(err.error);
        const msg = parsed.error;
        // console.log(msg);
        this.messageService.printError(msg);
        return EMPTY;
      }
      if (err.status >= 500) {
        this.messageService.printError('Server has some serious problems, contact administrator');
      }
    }
    console.error(err);
    return EMPTY;
  }
}
