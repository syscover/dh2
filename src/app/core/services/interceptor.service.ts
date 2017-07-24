import { Injectable } from '@angular/core';
import { Request, Response, XHRBackend, XHRConnection } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from './../../../environments/environment';

@Injectable()
export class InterceptorXHRBackend extends XHRBackend {

    createConnection(request: Request): XHRConnection {
        let connection: XHRConnection = super.createConnection(request);

        // pass callback to response has to take token from server and save in local storage
        connection.response = connection.response.do(this.processResponse);

        return connection;
    }

    processResponse(response: Response) {
        let authorization = response.headers.get('Authorization');

        if (environment.debug) console.log('DEBUG - Token authorization from http interceptor: ', authorization);

        if (authorization) {
            // segment string to avoid Bearer word, the header has this format 'Bearer eyJ0eXAiOiJKV1QiLCJh...'
            let token = authorization.split(' ');
            localStorage.setItem('token', token[1]);
        }

        return Observable.of(response);
    }
}
