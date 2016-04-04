import {Page} from 'ionic-angular';
import {AuthService} from "../../base/auth";
import {User} from "../../_typings";



@Page({
  templateUrl: 'build/pages/profile-settings/profile-settings.html',
  providers:[AuthService]
})


export class ProfileSettingsPage {

  user:User;

  //private student: Student;

  constructor(private authService:AuthService) {

    this.user = authService.getUser();
    console.log(this.user);
  }


/*
  login(credentials: Credentials) {
    let authHeaders = new Headers();
    const base64encodedCredentials = btoa(credentials.username + ":" + credentials.password);
    authHeaders.append('Authorization', 'Basic ' + base64encodedCredentials);

    return this.http.get("/api/students/_me", {
        headers: authHeaders
      })
      .toPromise()
      .then((data) => {
        let user: User = data.json();
        this.setUser({
          firstName: user.firstName,
          lastName: user.lastName,
          hskaId: user.hskaId,
          roles: user.roles
        });
        return user;
      });

  }

 */



}
