import {Page} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {Student} from "../../_typings";
import {HttpService} from "../../shared/services/httpService.ts";


@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  providers: [AuthService, HttpService]
})
export class Dashboard {

  showCoffeeCouponInsertField: boolean;
  student: Student;

  constructor(private authService: AuthService, private httpService: HttpService) {
    this.student = authService.getStudent();
    this.showCoffeeCouponInsertField = false;
  }

  setCouponInsertField() {
    this.showCoffeeCouponInsertField = (this.showCoffeeCouponInsertField == true) ? false : true;
    //ToDo: Folgendes steht hier nur zu testzwecken, da hier button ausgenutzt werden kann
    console.log(this.httpService.getTelemetry());
  }
}
