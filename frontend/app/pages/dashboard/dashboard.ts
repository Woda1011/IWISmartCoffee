import {Page} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {User} from "../../_typings";
import {HttpService} from "../../shared/services/httpService.service";


@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  providers:[AuthService,HttpService]
})
export class Dashboard {

  showCoffeCouponInsertField:boolean;
  user:User;

  constructor(private authService:AuthService, private httpService:HttpService){
    this.user = authService.getUser();
    this.showCoffeCouponInsertField=false;
  }


  makAnAltert(){
    alert("Ehhh Markus");
    console.log("Ehhh Markus ...........");
  }

  setCouponInsertField(){
    this.showCoffeCouponInsertField=(this.showCoffeCouponInsertField==true)?false:true;
    //ToDo: Folgendes steht hier nur zu testzwecken, da hier button ausgenutzt werden kann
    console.log(this.httpService.getTelemetry());

  }


}
