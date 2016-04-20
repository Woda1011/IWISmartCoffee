import {Page, Alert, IonicApp} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {User, Telemetry, CoffeeLog} from "../../_typings";
import {HttpService} from "../../shared/services/httpService.ts";
import {Observable} from "rxjs/Observable";
import {ControlGroup, AbstractControl, FormBuilder, Validators} from "angular2/common";


@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  providers: [AuthService, HttpService]
})
export class Dashboard {

  isLoggedIn: () => boolean;
  showCoffeCouponInsertField: boolean;
  user: User;
  telemetry: Telemetry = {};
  coffeeLog: CoffeeLog = {};

  coffeeCoinForm: ControlGroup;
  coinKey: AbstractControl;

  constructor(private app: IonicApp, private AuthService: AuthService, private httpService: HttpService,
              private FormBuilder: FormBuilder) {
    this.isLoggedIn = () => this.AuthService.isAuthenticated();
    this.user = AuthService.getUser();
    this.showCoffeCouponInsertField = false;
    this.initCoffeeCoinForm();

    this.getTelemetryData();
    this.pollTelemetryData().subscribe(telemetry => this.telemetry = telemetry);

    if (this.isLoggedIn()) {
      this.getCoffeeLog();
    }
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

  private getCoffeeLog() {
    this.httpService.getCoffeeLog(this.user.hskaId).subscribe(
      (coffeeLog) => this.coffeeLog = coffeeLog
    );
  }

  addCoffeeCoin(value) {
    this.httpService.addStudentCoffeeCoinMapping(value.coinKey)
      .subscribe(
        () => {
          let alert = Alert.create({
            title: 'Erfolg',
            subTitle: 'Die Kaffeemarke wurde deinem Konto gutgeschrieben.',
            buttons: ['OK']
          });

          let nav = this.app.getComponent('nav');
          nav.present(alert);
          
          this.initCoffeeCoinForm();
          this.getCoffeeLog();
          this.showCoffeCouponInsertField = false;
        },
        (err) => console.log(err)
      );
  }

  private initCoffeeCoinForm() {
    this.coffeeCoinForm = this.createCoffeeCoinForm();
    this.coinKey = this.coffeeCoinForm.controls['coinKey'];
  }

  private createCoffeeCoinForm() {
    return this.FormBuilder.group({
      'coinKey': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])]
    });
  }

  setCouponInsertField() {
    this.showCoffeCouponInsertField = (this.showCoffeCouponInsertField == true) ? false : true;
  }
}
