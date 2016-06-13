import {Page, NavController, NavParams} from "ionic-angular";
import {AuthService} from "../../base/auth";
import {Dashboard} from "../dashboard/dashboard";
import {RegisterPage} from "../register/register";
import {ControlGroup, Control, FormBuilder, Validators} from "@angular/common";

@Page({
  templateUrl: 'build/pages/login/login.html',
  providers: [AuthService]
})
export class LoginPage {

  loginForm: ControlGroup;
  private username: Control;
  private password: Control;

  constructor(private nav: NavController, private AuthService: AuthService, private navParams: NavParams,
              private FormBuilder: FormBuilder) {
    this.loginForm = FormBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.username = <Control>this.loginForm.controls['username'];
    this.password = <Control>this.loginForm.controls['password'];

    if (navParams.get('hskaId')) {
      this.username.updateValue(navParams.get('hskaId'));
    }
  }

  login(credentials) {
    this.AuthService.login(credentials).then(() => this.nav.setRoot(Dashboard));
  }

  register() {
    this.nav.setRoot(RegisterPage);
  }
}
