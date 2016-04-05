import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/Rx';
import {Storage, LocalStorage} from "ionic-angular";
import {Telemetry} from "../../_typings";
import {CookieService} from 'angular2-cookie/core';
import {AuthService} from "../../base/auth";


@Injectable()
export class HttpService {

  private store: Storage;
  private base64encodedCredentials: string;

  constructor(private http: Http, private CookieService: CookieService, private authService: AuthService) {
    this.store = new Storage(LocalStorage);
    this.base64encodedCredentials = this.store.get('base64encodedCredentials')._result;
    console.log("Credential Test  2:");
    console.log(this.base64encodedCredentials);

  }

  getTelemetry() {
    let authHeaders = new Headers();

    authHeaders.append('Authorization', 'Basic ' + this.base64encodedCredentials); //ToDo: Nicht so cool, sollte wieder raus, bei besseren Lösung (Interceptor)

    return this.http.get("/api/telemetry", {
        headers: authHeaders
      })
      .toPromise()
      .then((data) => {
        let telemetry: Telemetry = data.json();
        console.log(telemetry);
        return telemetry;
      });
  }

  /*
    ToDo: Hier weitere Zugriffe auf restservice realsiieren /Zusammenfassen
   */

}
