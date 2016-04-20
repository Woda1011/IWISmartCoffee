import {Page, IonicApp} from "ionic-angular";
import {AuthService} from "../../base/auth";
import {Dashboard} from "../dashboard/dashboard";

@Page({
  templateUrl: 'build/pages/login/login.html',
  providers: [AuthService]
})
export class LoginPage {

  constructor(private app: IonicApp, private AuthService: AuthService) {
  }

  login(credentials) {
    this.AuthService.login(credentials).then(() => {
      let nav = this.app.getComponent('nav');
      nav.setRoot(Dashboard);
    });
  }
}
