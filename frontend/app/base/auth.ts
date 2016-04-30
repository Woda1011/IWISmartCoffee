import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/Rx';
import {Storage, LocalStorage} from "ionic-angular";
import {Credentials, Student} from "../_typings";
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
    authHeaders.append('Authorization', 'Basic ' + base64encodedCredentials);
    return this.http.get("/api/students/_me", {
        headers: authHeaders
      })
      .toPromise()
      .then((res) => {
        let user: Student = res.json();
        this.setUser({
          firstName: user.firstName,
          lastName: user.lastName,
          hskaId: user.hskaId,
          roles: user.roles
        });
        this.store.set('token', base64encodedCredentials);
        return user;
      });
  }

  setUser(student: Student) {
    this.store.setJson('student', student);
  }

  getUser(): Student {
    let user = this.store.get('student')._result;
    return JSON.parse(user);
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  isAuthorized(authorizedRoles: string[]): boolean {
    if (!authorizedRoles) {
      return true;
    }
    var isAuthorized = false;
    let intersection = new Set([...authorizedRoles].filter(x => new Set(this.getUserRoles()).has(x)));
    if (intersection.size > 0) {
      isAuthorized = true;
    }

    return (this.isAuthenticated() && isAuthorized);
  }

  getUserRoles() {
    let user: Student = this.getUser();
    return user ? user.roles : [];
  }

  logout() {
    return this.http.post("/api/logout", "", {
      headers: new Headers({"X-XSRF-TOKEN": this.CookieService.get('XSRF-TOKEN')})
    }).toPromise().then(() => this.clearSession());
  }

  clearSession(): void {
    this.store.remove('student');
    this.store.remove('token');
    this.CookieService.remove('XSRF-TOKEN');
  }
}
