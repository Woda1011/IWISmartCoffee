import {Page, MenuController, IonicApp} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {Dashboard} from "../dashboard/dashboard";

@Page({
  templateUrl: 'build/pages/login/login.html',
  providers: [AuthService]
})
export class LoginPage {

  constructor(private app:IonicApp, private menu: MenuController, private AuthService: AuthService) {
    this.menu.swipeEnable(false);
  }

  login(credentials) {
    this.AuthService.login(credentials).then((data) => {
      console.log(data);
      let nav = this.app.getComponent('nav');
      nav.setRoot(Dashboard);
    });
  }
}
