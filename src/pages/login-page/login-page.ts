/**
 * LoginPage - Prihlasovacia stránka
 * Zobrazuje prihlasovací formulár (LoginForm komponent)
 * Po úspešnom prihlásení presmeruje používateľa na dashboard
 */
import { Component } from '@angular/core';
import { LoginForm } from '../../components/login-form/login-form';

@Component({
  selector: 'app-login-page',
  imports: [LoginForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {}
