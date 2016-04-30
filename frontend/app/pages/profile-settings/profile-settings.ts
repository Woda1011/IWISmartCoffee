import {Page} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {Student} from "../../_typings";

@Page({
  templateUrl: 'build/pages/profile-settings/profile-settings.html',
  providers: [AuthService]
})
export class ProfileSettingsPage {

  user: Student;

  constructor(private authService: AuthService) {
    this.user = authService.getUser();
  }
}
