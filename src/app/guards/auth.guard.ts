import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastrService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Use the synchronous method from AuthService
    if (this.authService.isUserAuthenticatedSync()) {
      return true;
    }

    // If not authenticated, redirect to login and show a message
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Optionally pass returnUrl
    this.toast.info('Você precisa estar logado para acessar esta página.', 'Acesso Negado'); // Added a title for clarity
    return false;
  }
}