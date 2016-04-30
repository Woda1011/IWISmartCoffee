import {Page} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {User} from "../../_typings";

@Page({
  templateUrl: 'build/pages/profile-settings/profile-settings.html',
  providers: [AuthService]
})
export class ProfileSettingsPage {

  user: User;

  constructor(private authService: AuthService) {
    this.user = authService.getUser();
  }
}
