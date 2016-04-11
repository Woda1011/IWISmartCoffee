import {Page} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {Student} from "../../_typings";

@Page({
  templateUrl: 'build/pages/profile-settings/profile-settings.html',
  providers: [AuthService]
})

export class ProfileSettingsPage {

  student: Student;

  constructor(private authService: AuthService) {
    this.student = authService.getStudent();
    console.log(this.student);
  }
}
