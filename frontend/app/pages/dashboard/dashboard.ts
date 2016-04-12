import {Page} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {User, Telemetry} from "../../_typings";
import {HttpService} from "../../shared/services/httpService.service";


@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  providers:[AuthService,HttpService]
})
export class Dashboard {

  showCoffeCouponInsertField:boolean;
  user:User;
  telemetry:Telemetry;

  constructor(private authService:AuthService, private httpService:HttpService){
    this.user = authService.getUser();
    this.showCoffeCouponInsertField=false;

    this.telemetry = this.httpService.getTelemetry();

    this.httpService.getTelemetry().then((data) => {
        console.log(data);
        this.telemetry = data;
        console.log(this.telemetry);
      });

    //this.telemetry = this.httpService.getTelemetry();
    //console.log(this.telemetry);
    //Object { id: 10, temperature: 56.4, humidity: 35.7, createdAt: 1459847771000 }
  }


  makAnAltert(){
    alert("Ehhh Markus");
    console.log("Ehhh Markus ...........");
  }

  setCouponInsertField(){
    this.showCoffeCouponInsertField=(this.showCoffeCouponInsertField==true)?false:true;
    //ToDo: Folgendes steht hier nur zu testzwecken, da hier button ausgenutzt werden kann
    //console.log(this.httpService.getTelemetry());

  }


}
