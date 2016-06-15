import "rxjs/Rx";
import {Telemetry, Student} from "../_typings";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {AuthHttp} from "./auth-http";

@Injectable()
export class HttpService {

  constructor(private http: Http, private AuthHttp: AuthHttp) {
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
    return this.AuthHttp.post("/api/coffee-coins/" + coinKey, null);
  }

  getCoffeeLog(hskaId: string) {
    return this.AuthHttp.get("/api/students/" + hskaId + "/coffee-log");
  }

  getStudents(hskaId?: string) {
    let params: URLSearchParams = new URLSearchParams();
    if (hskaId && hskaId !== '') {
      params.set('hskaId', hskaId);
    }
    return this.AuthHttp.get("/api/students", params).map(res => res.content);
  }

  getStudentByHskaId(hskaId: string) {
    return this.AuthHttp.get("/api/students/" + hskaId);
  }

  addStudent(student: Student) {
    return this.AuthHttp.post("/api/students", student);
  }

  updateStudent(student: Student) {
    return this.AuthHttp.put("/api/students/" + student.hskaId, student);
  }
}
