import {Page, NavController} from "ionic-angular";
import {AuthService} from "../../base/auth";
import {Dashboard} from "../dashboard/dashboard";

@Page({
  templateUrl: 'build/pages/login/login.html',
  providers: [AuthService]
})
export class LoginPage {

  constructor(private nav: NavController, private AuthService: AuthService) {
  }

  login(credentials) {
    this.AuthService.login(credentials).then(() => this.nav.setRoot(Dashboard));
  }
}
