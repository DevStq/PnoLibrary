import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        router.navigate(['/login']); // Redirect to login page if not logged in
        return false;
      }
    }),
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        console.warn('User is not logged in. Redirecting to login page.');
      }
    })
  );
};