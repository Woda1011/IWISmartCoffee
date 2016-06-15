import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {WebSocketService} from "./base/websocket-service";
import {CookieService} from "angular2-cookie/core";
import {AuthService} from "./base/auth";
import {Dashboard} from "./pages/dashboard/dashboard";
import {ProfileSettingsPage} from "./pages/profile-settings/profile-settings";
import {Students} from "./pages/students/students";
import {CoffeeCoin} from "./pages/coffee-coin/coffee-coin";
import {LoginPage} from "./pages/login/login";
import {AuthHttp} from "./base/auth-http";

@Component({
  templateUrl: 'build/app.html',
  providers: [
    AuthService,
    CookieService,
    AuthHttp,
    WebSocketService
  ]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  isLoggedIn: () => boolean;
  pages: Array<{title: string, component: any, authorizedRoles?: string[]}>;

  constructor(private platform: Platform, private menu: MenuController, private AuthService: AuthService) {
    this.rootPage = Dashboard;
    this.isLoggedIn = () => this.AuthService.isAuthenticated();
    this.initializeApp();

    // set our app's pages
    this.pages = [
      {title: 'Dashboard', component: Dashboard},
      {title: 'Coffee-Coins', component: CoffeeCoin, authorizedRoles: ["ROLE_ADMIN"]},
      {title: 'Studenten', component: Students, authorizedRoles: ["ROLE_ADMIN"]},
      {title: 'Profil Einstellungen', component: ProfileSettingsPage, authorizedRoles: ["ROLE_USER"]}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page);
  }

  isVisible(roles: string[]) {
    return this.AuthService.isAuthorized(roles);
  }

  login() {
    this.openPage(LoginPage);
  }

  logout() {
    this.AuthService.logout().then(() => this.openPage(LoginPage));
  }
}

ionicBootstrap(MyApp);
