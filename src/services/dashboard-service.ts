/**
 * DashboardService
 * Zabezpečuje komunikáciu so serverom ohľadom poznámok (notes) a skupín poznámok (note-groups)
 * Všetky operácie s poznámkami:
 * - Načítanie všetkých skupín poznámok
 * - Úprava jednotlivej poznámky
 * - Mazanie poznámky
 *
 * DÔLEŽITÉ: Všetky requesty automaticky obsahujú JWT token (pridáva tokenInterceptor)
 * Ak token chýba/je neplatný, backend vráti 401 Unauthorized
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Note } from '../entities/Notes/Note';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { environment } from '../environment/environment.development';
import { NoteGroup } from '../entities/NoteGroup/NoteGroup';
import { UserManagement } from './user-management';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private router = inject(Router);
  private userService = inject(UserManagement);

  public url = environment.restServer;

  constructor(private http: HttpClient) {}

  /**
   * Načíta všetky skupiny poznámok (note-groups) zo servera
   * Každá skupina obsahuje jej poznámky
   * Vyžaduje platný JWT token!
   */
  getDashboardData(): Observable<NoteGroup[]> {
    return this.http.get<NoteGroup[]>(`${this.url}api/note-groups`).pipe(
      map((jsonNoteGroups) => {
        return jsonNoteGroups.map((noteGroup) => NoteGroup.clone(noteGroup));
      }),
      catchError((error) => {
        // Ak server vráti 401 (Unauthorized), token je neplatný
        if (error.status === 401) {
          console.log('Token je neplatný alebo chýba, presmerovanie na login');
          localStorage.removeItem('authToken'); // Vymaž neplatný token
          this.router.navigate(['/login']); // Presmeruj na login
        }
        return throwError(() => this.userService.processErrors(error));
      }),
    );
  }

  getIndividualNoteGroup(id: number): Observable<NoteGroup> {
    return this.http.get<NoteGroup>(`${this.url}api/note-groups/${id}`).pipe(
      map((jsonNoteGroup) => {
        return NoteGroup.clone(jsonNoteGroup);
      }),
      catchError((error) => {
        if (error.status === 401) {
          console.log('Token je neplatný alebo chýba, presmerovanie na login');
          localStorage.removeItem('authToken'); // Vymaž neplatný token
          this.router.navigate(['/login']); // Presmeruj na login
        }
        return throwError(() => this.userService.processErrors(error));
      }),
    );
  }

  /**
   * Upraví obsah existujúcej poznámky
   * Pošle PATCH request na server s aktualizovanou poznámkou
   * Vyžaduje platný JWT token!
   */
  updateIndividualNote(note: Note): Observable<any> {
    console.log(note);
    return this.http.patch(`${this.url}api/note/${note.id}`, note).pipe(
      map((objects) => {
        console.log(objects);
        return objects;
      }),
      catchError((error) => {
        if (error.status === 401) {
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
        return throwError(() => this.userService.processErrors(error));
      }),
    );
  }

  updateNoteGroup(noteGroup: NoteGroup): Observable<NoteGroup> {
    return this.http.patch<NoteGroup>(`${this.url}api/note-groups/`, noteGroup).pipe(
      map((object) => {
        console.log(object);
        return object;
      }),
      catchError((err) => {
        if (err.status === 401) {
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
        return throwError(() => this.userService.processErrors(err));
      }),
    );
  }

  /**
   * Zmaže poznámku zo servera
   * Pošle DELETE request s ID poznámky
   * Vyžaduje platný JWT token!
   */
  removeIndividualNote(noteId: number): Observable<any> {
    return this.http.delete(`${this.url}api/note/${noteId}`).pipe(
      catchError((error) => {
        // if (error.status === 401) {
        //   localStorage.removeItem('authToken');
        //   this.router.navigate(['/login']);
        // }
        console.error(error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Vytvorí novú skupinu poznámok (note-group)
   * Môže obsahovať poznámky hneď pri vytvorení (notes je voliteľné)
   * @param name Názov novej skupiny
   * @param notes Poznámky (voliteľné) - môže byť prázdne pole alebo undefined
   */
  createNoteGroup(noteGroup: NoteGroup): Observable<any> {
    // const noteGroup = {
    //   name: name,
    //   notes: notes || [], // Ak notes nie je poskytnuté, pošle prázdne pole
    // };
    return this.http.post(`${this.url}api/note-groups/`, noteGroup).pipe(
      catchError((error) => {
        if (error.status === 401) {
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
        return throwError(() => this.userService.processErrors(error));
      }),
    );
  }

  /**
   * Premenuje existujúcu skupinu poznámok
   * @param groupId ID skupiny, ktorú chceme premenovať
   * @param newName Nový názov skupiny
   */
  renameNoteGroup(groupId: number, newName: string): Observable<any> {
    const body = { name: newName };
    return this.http.patch(`${this.url}api/note-groups/${groupId}`, body).pipe(
      catchError((error) => {
        if (error.status === 401) {
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
        console.error(error);
        return throwError(() => error);
      }),
    );
  }

  deleteNoteGroup(noteGroup: NoteGroup): Observable<NoteGroup> {
    return this.http.delete<NoteGroup>(`${this.url}api/note-groups/?id=${noteGroup.id}`).pipe(
      map((object) => {
        console.log(object);
        return object;
      }),
      catchError((error) => {
        if (error.status === 401) {
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
        return throwError(() => this.userService.processErrors(error));
      }),
    );
  }

  /**
   * Pridá novú poznámku do existujúcej skupiny
   * @param groupId ID skupiny, do ktorej pridávame poznámku
   * @param note Poznámka na pridanie
   */
  addNoteToGroup(groupId: number, note: Note): Observable<any> {
    return this.http.post(`${this.url}api/note-groups/${groupId}/notes`, note).pipe(
      catchError((error) => {
        if (error.status === 401) {
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
        return throwError(() => this.userService.processErrors(error));
      }),
    );
  }

  getTimeStampFilter(): Observable<any> {
    return this.http.get<any>(`${this.url}api/note-groups/unique-creation-dates`).pipe(
      map((result) => {
        // console.log(result);
        return result;
      }),
      catchError((error) => {
        if (error.status === 401) {
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
        return throwError(() => this.userService.processErrors(error));
      }),
    );
  }
}
