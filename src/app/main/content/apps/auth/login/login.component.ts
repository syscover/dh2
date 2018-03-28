import { ValidationMessageService } from './../../../core/services/validation-message.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseConfigService } from '../../../../../../@fuse/services/config.service';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { environment } from './../../../../../../environments/environment';
import { AuthenticationService } from './../../../core/services/authentication.service';

@Component({
    selector   : 'dh2-login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    loginFormErrors: any;
    loading = false;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private validationMessageService: ValidationMessageService
    )
    {
        this.fuseConfig.setConfig({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.loginFormErrors = {
            user    : {},
            password: {}
        };
    }

    ngOnInit()
    {
        const remenberme = localStorage.getItem('remember_me') ? JSON.parse(localStorage.getItem('remember_me')) : null;

        this.loginForm = this.formBuilder.group({
            user        : [remenberme && remenberme.user ? remenberme.user : null, [Validators.required, Validators.email, Validators.minLength(2)]],
            password    : [remenberme && remenberme.password ? remenberme.password : null, Validators.required],
            remember_me : false
        });

        this.validationMessageService.subscribeForm(this.loginForm, this.loginFormErrors);

        /* this.loginForm.valueChanges.subscribe(() => {
            this.onLoginFormValuesChanged();
        }); */
    }

    onLoginFormValuesChanged()
    {
        for (const field in this.loginFormErrors)
        {
            if (! this.loginFormErrors.hasOwnProperty(field))
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && ! control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    login() 
    {
        this.loading = true;

        this.authenticationService
            .login(this.loginForm.value)
            .subscribe(response => {

                if (environment.debug) console.log('DEBUG - response after login: ', response);

                localStorage.setItem('access_token', response['access_token']);

                // remenber me function
                if (this.loginForm.value.remember_me) 
                {
                    localStorage.setItem('remember_me', JSON.stringify({
                        user: this.loginForm.value.user,
                        password: this.loginForm.value.password,
                    }));
                }
                
                // redirect to admin or retrieve the url you wanted to go
                if (this.authenticationService.redirectUrl) 
                {
                    this.router.navigate([this.authenticationService.redirectUrl]);
                } 
                else 
                {
                    this.router.navigate(['/apps/dashboard']);
                }
            }, (error) => {
                this.loading = false;
                

                // this.msgs = [];
                // this.msgs.push({severity: 'error', summary: 'Authentication error', detail: 'Your user or password is incorrect'});
            });
    }
}

