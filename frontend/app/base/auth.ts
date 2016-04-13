import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/Rx';
import {Storage, LocalStorage} from "ionic-angular";
import {Credentials, User} from "../_typings";
import {CookieService} from 'angular2-cookie/core';

@Injectable()
export class AuthService {

  private store: Storage;

  constructor(private http: Http, private CookieService: CookieService) {
    this.store = new Storage(LocalStorage);
  }

  login(credentials: Credentials) {
    let authHeaders = new Headers();
    const base64encodedCredentials = btoa(credentials.username + ":" + credentials.password);
    this.store.set('base64encodedCredentials', base64encodedCredentials); //ToDo: Nicht so cool, sollte wieder raus, bei besseren Lösung (Interceptor)
    authHeaders.append('Authorization', 'Basic ' + base64encodedCredentials);

    return this.http.get("/api/students/_me", {
        headers: authHeaders
      })
      .toPromise()
      .then((data) => {
        let user: User = data.json();
        this.setUser({
          firstName: user.firstName,
          lastName: user.lastName,
          hskaId: user.hskaId,
          roles: user.roles
        });
        return user;
      });
  }

  setUser(user: User) {
    this.store.setJson('user', user);
  }

  getUser(): User {
    let user = this.store.get('user')._result;
    return JSON.parse(user);
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  isAuthorized(authorizedRoles: string[]): boolean {
    var isAuthorized = false;
    let intersection = new Set([...authorizedRoles].filter(x => new Set(this.getUserRoles()).has(x)));
    if (intersection.size > 0) {
      isAuthorized = true;
    }

    return (this.isAuthenticated() && isAuthorized);
  }

  getUserRoles() {
    let user: User = this.getUser();
    return user ? user.roles : [];
  }

  logout() {
    return this.http.post("/api/logout", "", {
      headers: new Headers({"X-XSRF-TOKEN": this.CookieService.get('XSRF-TOKEN')})
    }).toPromise().then(() => this.clearSession());
  }

  clearSession(): void {
    this.store.remove('user');
    this.CookieService.remove('XSRF-TOKEN');
  }
}
