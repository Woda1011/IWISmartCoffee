import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/Rx';
import {Storage, LocalStorage} from "ionic-angular";
import {Telemetry} from "../../_typings";
import {Observable} from "rxjs/Observable";
import {AuthHttp} from "../../base/authHttp";


@Injectable()
export class HttpService {

  private store: Storage;
  private base64encodedCredentials: string;

  constructor(private authHttp: AuthHttp) {
    this.store = new Storage(LocalStorage);
    this.base64encodedCredentials = this.store.get('base64encodedCredentials')._result;
  }

  getTelemetry() {
    return this.authHttp.get("/api/telemetry")
      .map(res => <Telemetry> res.json())
      .map(telemetry => {
        telemetry.createdAt = new Date(telemetry.createdAt);
        return telemetry;
      })
      .catch(error => Observable.throw(error.json()));
  }

  private getAuthHeader(): Headers {
    let authHeaders = new Headers();
    authHeaders.append('Authorization', 'Basic ' + this.base64encodedCredentials);
    return authHeaders;
  }

  /*
   ToDo: Hier weitere Zugriffe auf restservice realsiieren /Zusammenfassen
   */

}
