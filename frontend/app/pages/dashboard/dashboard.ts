import {Page} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {User, Telemetry} from "../../_typings";
import {HttpService} from "../../shared/services/httpService.ts";
import {Observable} from "rxjs/Observable";


@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  providers: [AuthService, HttpService]
})
export class Dashboard {

  showCoffeCouponInsertField: boolean;
  user: User;
  telemetry: Telemetry = {};

  constructor(private authService: AuthService, private httpService: HttpService) {
    this.user = authService.getUser();
    this.showCoffeCouponInsertField = false;

    this.getTelemetryData();
    this.pollTelemetryData().subscribe(telemetry => this.telemetry = telemetry);
  }

  /** Required for initial load */
  private getTelemetryData() {
    this.httpService.getTelemetry().subscribe(telemetry => this.telemetry = telemetry);
  }

  /** Check for new telemetry data every 30 seconds */
  private pollTelemetryData() {
    return Observable.interval(30000).flatMap(() => {
      return this.httpService.getTelemetry();
    });
  }

  makAnAltert() {
    alert("Ehhh Markus");
    console.log("Ehhh Markus ...........");
  }

  setCouponInsertField() {
    this.showCoffeCouponInsertField = (this.showCoffeCouponInsertField == true) ? false : true;
    //ToDo: Folgendes steht hier nur zu testzwecken, da hier button ausgenutzt werden kann
    //console.log(this.httpService.getTelemetry());
  }
}
