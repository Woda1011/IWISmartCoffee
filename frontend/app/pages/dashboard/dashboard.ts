import {Page} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {User, TelemertyClass} from "../../_typings";
import {HttpService} from "../../shared/services/httpService.service";
import {Observable} from 'rxjs/Rx';


@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  providers:[AuthService,HttpService]
})
export class Dashboard {

  showCoffeCouponInsertField:boolean;
  user:User;
  telemetry:TelemertyClass;

  constructor(private authService:AuthService, private httpService:HttpService){
    this.user = authService.getUser();
    this.showCoffeCouponInsertField=false;


    // Hier wird startwert zugewesen
    // ToDo: eleganter als das hier lösen
    this.telemetry = new TelemertyClass(0,0,0,0,0);


    this.getTelemetryData();

    this.observerTest();
  }

  /*
   * ToDo: Observer soll hier "this.httpService.getTelemetry()" ausführen
   */
   observerTest() {
      Observable.interval(5000)
        .map((x) => x+1)
        .subscribe((x) => {
          console.log("Neue Telemetriedaten: "+ x);
        });
    }

  getTelemetryData(){
    this.httpService.getTelemetry().then((data) => {
      this.telemetry = data;
      let d = new Date();
      this.telemetry.lastLoadedDateTime = d.getTime();
      console.log(this.telemetry);
    });
  }

  makAnAltert(){
    alert("Ehhh Markus");
    console.log("Ehhh Markus ...........");
  }

  setCouponInsertField(){
    this.showCoffeCouponInsertField=(this.showCoffeCouponInsertField==true)?false:true;
  }
}
