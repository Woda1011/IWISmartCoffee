import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/Rx';
import {Storage, LocalStorage} from "ionic-angular";
import {Telemetry} from "../../_typings";
import {Observable} from "rxjs/Observable";


@Injectable()
export class HttpService {

  private store: Storage;
  private base64encodedCredentials: string;

  constructor(private http: Http) {
    this.store = new Storage(LocalStorage);
    this.base64encodedCredentials = this.store.get('base64encodedCredentials')._result;
  }

  getTelemetry() {
    return this.http.get("/api/telemetry", {
        headers: this.getAuthHeader()
      })
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
