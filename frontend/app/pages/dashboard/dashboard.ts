import {Page} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {User} from "../../_typings";


@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  providers:[AuthService]
})
export class Dashboard {

  showCoffeCouponInsertField:boolean;
  user:User;

  constructor(private authService:AuthService){
    this.user = authService.getUser();
    this.showCoffeCouponInsertField=false;
  }


  makAnAltert(){
    alert("Ehhh Markus");
    console.log("Ehhh Markus ...........");
  }


  setCouponInsertField(){
    this.showCoffeCouponInsertField=(this.showCoffeCouponInsertField==true)?false:true;
  }


}
