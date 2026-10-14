/**
 * LoginForm - Prihlasovací formulár
 * Obsahuje polia pre zadanie používateľského mena a hesla
 * 
 * Proces prihlásenia:
 * 1. Používateľ zadá meno a heslo
 * 2. Validácia - polia nesmú byť prázdne
 * 3. Odoslanie na server cez UserManagement.login()
 * 4. Ak úspech -> presmerovanie na /dashboard
 * 5. Ak chyba -> zobrazí sa chybová hláška (cez MessageService)
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '../../entities/auth';
import { UserManagement } from '../../services/user-management';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  userService = inject(UserManagement);
  router = inject(Router);

  // Reactive form s polami username a password
  form = new FormGroup({
    uname: new FormControl(''),
    password: new FormControl(''),
  });

  /**
   * Spracovanie odoslania formulára
   * 1. Validuje, že polia nie sú prázdne
   * 2. Odošle prihlasovací request
   * 3. Pri úspechu presmeruje na dashboard
   */
  onSubmit($event: Event) {
    $event.preventDefault();

    const unameValue = this.form.get('uname')?.value || '';
    const passwordValue = this.form.get('password')?.value || '';

    // Validácia username - nesmie byť prázdne
    if (unameValue.trim() === '') {
      this.form.controls['uname'].setErrors({ required: true });
      this.form.controls['uname'].markAsTouched();
    } else {
      this.form.controls['uname'].setErrors(null);
    }

    // Validácia password - nesmie byť prázdne
    if (passwordValue.trim() === '') {
      this.form.controls['password'].setErrors({ required: true });
      this.form.controls['password'].markAsTouched();
    } else {
      this.form.controls['password'].setErrors(null);
    }

    // Ak sú obe polia vyplnené, odošli prihlasovací request
    if (unameValue.trim() !== '' && passwordValue.trim() !== '') {
      const payload: Auth = {
        username: unameValue,
        password: passwordValue,
      };

      // Prihlásenie cez UserManagement service
      this.userService.login(payload).subscribe(() => {
        this.router.navigate(['/dashboard']); // Presmerovanie na dashboard
      });
    }
  }
}
