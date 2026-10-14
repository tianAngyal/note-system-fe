/**
 * Auth - Dátová trieda pre prihlasovacie údaje
 * Obsahuje username a password
 * Používa sa pri odosielaní prihlasovacieho requestu na server
 */
export class Auth {
  constructor(public username: string = '', public password: string = '') {}
}
