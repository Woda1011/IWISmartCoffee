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

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeaders(headers);
    return this.http.get(url, {headers: headers})
      .do(res => {
        this.checkIfXsrfTokenIsValid(res);
      });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeaders(headers);
    this.createXSRFHeaders(headers);
    return this.http.post(url, data, {headers: headers})
      .do(res => {
        this.checkIfXsrfTokenIsValid(res);
      });
  }

  private checkIfXsrfTokenIsValid(res) {
    let token = res.headers.get('x-xsrf-token');
    if (!token || token !== this.CookieService.get('XSRF-TOKEN')) {
      this.store.remove('user');
      this.CookieService.remove('XSRF-TOKEN');
    }
  }
}
