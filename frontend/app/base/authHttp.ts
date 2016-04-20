import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import {Storage, LocalStorage, IonicApp} from "ionic-angular";
import {CookieService} from "angular2-cookie/core";
import {LoginPage} from "../pages/login/login";

@Injectable()
export class AuthHttp {

  private store: Storage;
  private xsrfToken: string;

  constructor(private app: IonicApp, private http: Http, private CookieService: CookieService) {
    this.store = new Storage(LocalStorage);
    this.xsrfToken = this.CookieService.get('XSRF-TOKEN');
  }

  private createAuthorizationHeaders(headers: Headers) {
    let token = this.store.get('base64encodedCredentials')._result;
    headers.append('Authorization', 'Basic ' + token);
  }

  private createXSRFHeaders(headers: Headers) {
    this.xsrfToken = this.CookieService.get('XSRF-TOKEN');
    headers.append('X-XSRF-TOKEN', this.xsrfToken);
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
    if (!token || token !== this.xsrfToken) {
      console.log("xsrf-token are not the same --> logging out");
      this.store.remove('user');
      this.CookieService.remove('XSRF-TOKEN');

      let nav = this.app.getComponent('nav');
      nav.setRoot(LoginPage);
    }
  }
}
