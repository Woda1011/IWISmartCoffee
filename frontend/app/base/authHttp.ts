import {Storage, LocalStorage} from "ionic-angular";
import {CookieService} from "angular2-cookie/core";
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";

@Injectable()
export class AuthHttp {

  private store: Storage;

  constructor(private http: Http, private CookieService: CookieService) {
    this.store = new Storage(LocalStorage);
  }

  private getAuthorizationHeaders() {
    return this.store.get('token');
  }

  private createXSRFHeaders(headers: Headers) {
    headers.append('X-XSRF-TOKEN', this.CookieService.get('XSRF-TOKEN'));
  }

  get(url, params?): any {
    let headers = new Headers();
    return this.getAuthorizationHeaders().then((token) => {
      headers.append('Authorization', token);
      return this.http.get(url, {headers: headers, search: params})
          .toPromise()
          .then(res => this.checkIfXsrfTokenIsValid(res));
    });
  }

  post(url, data): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.getAuthorizationHeaders().then((token) => {
      headers.append('Authorization', token);
      this.createXSRFHeaders(headers);
      return this.http.post(url, JSON.stringify(data), {headers: headers})
          .toPromise()
          .then(res => this.checkIfXsrfTokenIsValid(res));
    });
  }

  put(url, data): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.getAuthorizationHeaders().then((token) => {
      headers.append('Authorization', token);
      this.createXSRFHeaders(headers);
      return this.http.put(url, JSON.stringify(data), {headers: headers})
          .toPromise()
          .then(res => this.checkIfXsrfTokenIsValid(res));
    });
  }

  private checkIfXsrfTokenIsValid(res) {
    let token = res.headers.get('x-xsrf-token');
    // On the server the headers are uppercase so we try to get the uppercase header
    if (!token) {
      token = res.headers.get('X-XSRF-TOKEN');
    }
    if (!token || token !== this.CookieService.get('XSRF-TOKEN')) {
      console.log("Token is not valid anymore!");
      this.store.remove('student');
      this.store.remove('token');
      this.CookieService.remove('XSRF-TOKEN');
    }
    try {
      return res.json();
    } catch (e) {
      return res;
    }
  }
}
