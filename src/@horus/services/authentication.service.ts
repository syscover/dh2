import { Injectable, Injector } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpService } from '@horus/services/http.service';
import { User } from '@horus/types';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService extends HttpService
{
    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(
        protected injector: Injector,
        private jwtHelperService: JwtHelperService
    )
    {
        super(injector);
        this.setEndpoint('/api/v1/login'); // set api URL
    }

    login(user: any): Observable<Object>
    {
        // send credentials to server
        return this.http
            .post(this.getEndpoint('login'), {
                guard: 'admin',
                user: user.user,
                password: user.password,
                remember_me: user.remember_me
            }, this.options);
    }

    logout(): void
    {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_logged');
        this.apollo.getClient().resetStore();
    }

    check(): boolean
    {
        const token: string = this.jwtHelperService.tokenGetter();
        if (! token)
        {
            return false;
        }
        const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token);
        return ! tokenExpired;
    }

    user(): User
    {
        if (localStorage.getItem('user_logged'))
        {
            return <User>JSON.parse(atob(localStorage.getItem('user_logged')));
        }

        return null;
    }

    getAuthToken (): any
    {
        if (localStorage.getItem('access_token'))
        {
            return localStorage.getItem('access_token');
        }
        return null;
    }
}
