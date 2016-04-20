import {Injectable} from "angular2/core";
import "rxjs/Rx";
import {Telemetry, CoffeeLog} from "../../_typings";
import {Observable} from "rxjs/Observable";
import {AuthHttp} from "../../base/authHttp";
import {Http} from "angular2/http";

@Injectable()
export class HttpService {

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  getTelemetry() {
    return this.http.get("/api/telemetry")
      .map(res => <Telemetry> res.json())
      .map(telemetry => {
        telemetry.createdAt = new Date(telemetry.createdAt);
        return telemetry;
      })
      .catch(error => Observable.throw(error.json()));
  }

  addStudentCoffeeCoinMapping(coinKey: string) {
    return this.authHttp.post("/api/coffee-coins/" + coinKey, null);
  }

  getCoffeeLog(hskaId: string) {
    return this.authHttp.get("/api/students/" + hskaId + "/coffee-log").map(res => <CoffeeLog> res.json());
  }
}
