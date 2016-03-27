import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/Rx';

@Injectable()
export class AuthService {

  constructor(private http: Http) {
  }

  login(credentials) {
    let authHeaders = new Headers();
    const base64encodedCredentials = btoa(credentials.username + ":" + credentials.password);
    authHeaders.append('Authorization', 'Basic ' + base64encodedCredentials);

    return this.http.get("/api/students/_me", {
        headers: authHeaders
      })
      .toPromise()
      .then((data) => {
        console.log("Edit data in service");
        return data.json();
      });
  }
}
