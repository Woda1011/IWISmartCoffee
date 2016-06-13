import 'rxjs/Rx';
import {Storage, LocalStorage} from "ionic-angular";
import {Credentials, Student} from "../_typings";
import {CookieService} from 'angular2-cookie/core';
import {Http, Headers} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthService {

  private store: Storage;
  private user;

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
            roles: user.roles,
            hasCampusCardMapped: user.campusCardId ? true : false
          });
          this.store.set('token', base64encodedCredentials);
          return user;
        });
  }

  setUser(student: Student) {
    this.user = student;
    this.store.setJson('student', student);
  }

  getUser(): Promise<Student> {
    return this.store.get('student').then((result) => {
      let user = JSON.parse(result);
      this.user = user;
      return user;
    });
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }

  isAuthorized(authorizedRoles: string[]): boolean {
    if (!authorizedRoles) {
      return true;
    }
    var isAuthorized = false;
    let intersection = new Set([...authorizedRoles].filter(x => new Set(this.user ? this.user.roles : []).has(x)));
    if (intersection.size > 0) {
      isAuthorized = true;
    }

    return (this.isAuthenticated() && isAuthorized);
  }

  getUserRoles() {
    return this.getUser().then((user) => user ? user.roles : []);
  }

  logout() {
    return this.http.post("/api/logout", "", {
      headers: new Headers({"X-XSRF-TOKEN": this.CookieService.get('XSRF-TOKEN')})
    }).toPromise().then(() => this.clearSession());
  }

  clearSession(): void {
    this.user = undefined;
    this.store.remove('student');
    this.store.remove('token');
    this.CookieService.remove('XSRF-TOKEN');
  }
}
