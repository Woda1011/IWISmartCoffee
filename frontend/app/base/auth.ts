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
    this.store.set('base64encodedCredentials', base64encodedCredentials); //ToDo: Nicht so cool, sollte wieder raus, bei besseren Lösung (Interceptor)
    authHeaders.append('Authorization', 'Basic ' + base64encodedCredentials);

    return this.http.get("/api/students/_me", {
        headers: authHeaders
      })
      .toPromise()
      .then((data) => {
        let student: Student = data.json();
        this.setStudent({
          firstName: student.firstName,
          lastName: student.lastName,
          hskaId: student.hskaId,
          roles: student.roles
        });
        return student;
      });
  }

  setStudent(student: Student) {
    this.store.setJson('student', student);
  }

  getStudent(): Student {
    return JSON.parse(this.store.get('student')._result);
  }

  isAuthenticated(): boolean {
    return !!this.getStudent();
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
    let user: Student = this.getStudent();
    return user ? user.roles : [];
  }

  logout() {
    return this.http.post("/api/logout", "", {
      headers: new Headers({"X-XSRF-TOKEN": this.CookieService.get('XSRF-TOKEN')})
    }).toPromise().then(() => this.clearSession());
  }

  clearSession(): void {
    this.store.remove('student');
    this.CookieService.remove('XSRF-TOKEN');
  }
}
