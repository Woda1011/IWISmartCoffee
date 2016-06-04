import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import {Storage, LocalStorage} from "ionic-angular";
import {CookieService} from "angular2-cookie/core";

@Injectable()
export class AuthHttp {

  private store: Storage;

  constructor(private http: Http, private CookieService: CookieService) {
    this.store = new Storage(LocalStorage);
  }

  private createAuthorizationHeaders(headers: Headers) {
    let token = this.store.get('token')._result;
    headers.append('Authorization', 'Basic ' + token);
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
      this.store.remove('student');
      this.store.remove('token');
      this.CookieService.remove('XSRF-TOKEN');
    }
  }
}
