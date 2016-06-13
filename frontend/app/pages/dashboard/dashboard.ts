import {Page, Alert, NavController} from "ionic-angular";
import {AuthService} from "../../base/auth";
import {Student, Telemetry, CoffeeLog} from "../../_typings";
import {HttpService} from "../../shared/services/httpService.ts";
import {Observable} from "rxjs/Observable";
import {ControlGroup, AbstractControl, FormBuilder, Validators} from "@angular/common";


@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  providers: [AuthService, HttpService]
})
export class Dashboard {

  isLoggedIn: () => boolean;
  showCoffeCouponInsertField: boolean;
  user: Student;
  telemetry: Telemetry = {};
  coffeeLog: CoffeeLog = {};

  coffeeCoinForm: ControlGroup;
  coinKey: AbstractControl;
  private timeLeft;
  private intervalId;

  constructor(private AuthService: AuthService, private httpService: HttpService,
              private FormBuilder: FormBuilder, private nav: NavController) {
    this.isLoggedIn = () => this.AuthService.isAuthenticated();
    this.showCoffeCouponInsertField = false;
    this.initCoffeeCoinForm();
    this.getTelemetryData();

    this.pollTelemetryData().subscribe(telemetry => this.telemetry = telemetry);

    AuthService.getUser()
        .then((user) => {
          this.user = user;
          if (this.user) {
            this.getCoffeeLog();
          }
        });
  }

  /** Required for initial load */
  private getTelemetryData() {
    this.httpService.getTelemetry().subscribe(telemetry => {
      this.telemetry = telemetry;
      if (this.telemetry.isBrewing) {
        let now: any = new Date();
        let timeLeft = now - this.telemetry.createdAt;
        if (timeLeft <= 1800000) {
          this.timeLeft = new Date(1800000 - timeLeft);
          this.startInterval(this.telemetry.createdAt);
        }
      } else {
        clearInterval(this.intervalId);
        this.timeLeft = undefined;
      }
    });
  }

  private startInterval(timeLeft) {
    this.intervalId = setInterval(() => {
      let newDate = <any>new Date() - timeLeft;
      if (newDate <= 1800000) {
        this.timeLeft = new Date(1800000 - newDate);
      } else {
        clearInterval(this.intervalId);
        this.timeLeft = undefined;
      }
    }, 1000);
  }

  /** Check for new telemetry data every 30 seconds */
  private pollTelemetryData() {
    return Observable.interval(30000).flatMap(() => {
      return this.httpService.getTelemetry();
    });
  }

  private getCoffeeLog() {
    this.httpService.getCoffeeLog(this.user.hskaId).then(
        (coffeeLog) => this.coffeeLog = coffeeLog
    );
  }

  addCoffeeCoin(value) {
    this.httpService.addStudentCoffeeCoinMapping(value.coinKey)
        .then(
            () => {
              let alert = Alert.create({
                title: 'Erfolg',
                subTitle: 'Die Kaffeemarke wurde deinem Konto gutgeschrieben.',
                buttons: ['OK']
              });
              this.nav.present(alert);

              this.initCoffeeCoinForm();
              this.getCoffeeLog();
              this.showCoffeCouponInsertField = false;
            },
            (err) => {
              let alert = Alert.create({
                title: 'Fehler',
                subTitle: 'Servernachricht: ' + JSON.parse(err._body).message,
                buttons: ['OK']
              });
              this.nav.present(alert);
            }
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
