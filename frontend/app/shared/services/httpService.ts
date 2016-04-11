import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/Rx';

@Injectable()
export class HttpService {

  constructor(private http: Http) {
  }

  getTelemetry() {
    return this.http.get("/api/telemetry")
      .toPromise()
      .then((data) => {
        return data.json();
      });
  }

  /*
    ToDo: Hier weitere Zugriffe auf restservice realsiieren /Zusammenfassen
   */

}
