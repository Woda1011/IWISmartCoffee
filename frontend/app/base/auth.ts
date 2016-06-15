import 'rxjs/Rx';
import {Credentials, Student} from "../_typings";
import {CookieService} from 'angular2-cookie/core';
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";

@Injectable()
export class AuthService {

  constructor(private http: Http, private CookieService: CookieService) {
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
        this.CookieService.put('token', base64encodedCredentials);
        return user;
      });
  }

  setUser(student: Student) {
    this.CookieService.put('student', JSON.stringify(student));
  }

  getUser(): Student {
    try {
      return JSON.parse(this.CookieService.get('student'));
    } catch (e) {
      return undefined;
    }
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
    return this.getUser() ? this.getUser().roles : [];
  }

  logout() {
    return this.http.post("/api/logout", "", {
      headers: new Headers({"X-XSRF-TOKEN": this.CookieService.get('XSRF-TOKEN')})
    }).toPromise().then(() => this.clearSession());
  }

  clearSession(): void {
    this.CookieService.remove('token');
    this.CookieService.remove('student');
    this.CookieService.remove('XSRF-TOKEN');
  }
}
