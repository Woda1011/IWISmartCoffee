import {CookieService} from "angular2-cookie/core";
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";

@Injectable()
export class AuthHttp {

  constructor(private http: Http, private CookieService: CookieService) {
  }

  private createAuthorizationHeaders(headers: Headers) {
    let token = this.CookieService.get('token');
    if (token) {
      headers.append('Authorization', 'Basic ' + token);
    }
  }

  private createXSRFHeaders(headers: Headers) {
    headers.append('X-XSRF-TOKEN', this.CookieService.get('XSRF-TOKEN'));
  }

  get(url, params?) {
    let headers = new Headers();
    this.createAuthorizationHeaders(headers);
    return this.http.get(url, {headers: headers, search: params})
      .do(res => this.checkIfXsrfTokenIsValid(res))
      .map(res => res.json());
  }

  post(url, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.createAuthorizationHeaders(headers);
    this.createXSRFHeaders(headers);
    return this.http.post(url, JSON.stringify(data), {headers: headers})
      .do(res => this.checkIfXsrfTokenIsValid(res))
      .map(res => {
        try {
          return res.json();
        } catch (e) {
          return;
        }
      });
  }

  put(url, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.createAuthorizationHeaders(headers);
    this.createXSRFHeaders(headers);
    return this.http.put(url, JSON.stringify(data), {headers: headers})
      .do(res => this.checkIfXsrfTokenIsValid(res))
      .map(res => res.json());
  }

  private checkIfXsrfTokenIsValid(res) {
    let token = res.headers.get('x-xsrf-token');
    // On the server the headers are uppercase so we try to get the uppercase header
    if (!token) {
      token = res.headers.get('X-XSRF-TOKEN');
    }
    if (!token || token !== this.CookieService.get('XSRF-TOKEN')) {
      console.log("Token is not valid anymore!");
      this.CookieService.remove('student');
      this.CookieService.remove('token');
      this.CookieService.remove('XSRF-TOKEN');
    }
  }
}
