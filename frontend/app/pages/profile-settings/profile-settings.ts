import {Page} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {Student} from "../../_typings";

@Page({
  templateUrl: 'build/pages/profile-settings/profile-settings.html',
  providers: [AuthService]
})
export class ProfileSettingsPage {

  user: Student;

  constructor(private AuthService: AuthService) {
    AuthService.getUser().then((user) => this.user = user);
  }
}
