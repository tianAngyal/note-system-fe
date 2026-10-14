/**
 * TokenInterceptor - HTTP Interceptor pre automatické pridávanie tokenu
 *
 * Tento interceptor sa automaticky spustí pri KAŽDOM HTTP requeste
 * Pridá Authorization header s JWT tokenom do každého requestu
 *
 * Proces:
 * 1. Získa token z localStorage
 * 2. Ak token existuje, pridá ho do Authorization headera
 * 3. Format: "Bearer <token>"
 * 4. Request pokračuje na server s tokenom
 *
 * Backend potom môže overiť tento token a rozhodnúť, či request povolí
 */
import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Získaj token z localStorage
  const token = localStorage.getItem('authToken');
  // const stringData = localStorage.getItem('authToken');
  // const parsedData = JSON.parse(stringData as string);
  // const token = parsedData?.token;

  // Ak token existuje a obsahuje len ASCII znaky (validný JWT)
  if (token && token.trim().length > 0) {
    try {
      // JWT token by mal obsahovať len ASCII znaky (base64)
      // Ak obsahuje non-ASCII znaky, nie je to validný token
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`, // Format: "Bearer <token>"
        },
      });
      return next(clonedRequest);
    } catch (error) {
      console.error('Error adding token to request:', error);
      // Ak zlyhá pridanie tokenu, vymaž neplatný token
      localStorage.removeItem('authToken');
      return next(req);
    }
  }

  // Ak token neexistuje, pošli request bez zmeny
  return next(req);
};
