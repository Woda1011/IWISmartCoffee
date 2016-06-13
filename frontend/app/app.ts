import {App, IonicApp, Platform, MenuController} from "ionic-angular";
import {CookieService} from "angular2-cookie/core";
import {Dashboard} from "./pages/dashboard/dashboard";
import {CoffeeCoin} from "./pages/coffee-coin/coffee-coin";
import {ProfileSettingsPage} from "./pages/profile-settings/profile-settings";
import {LoginPage} from "./pages/login/login";
import {AuthService} from "./base/auth";
import {AuthHttp} from "./base/authHttp";
import {Students} from "./pages/students/students";
import {WebSocketService} from "./base/websocket-service";

@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [
    AuthService,
    CookieService,
    AuthHttp,
    WebSocketService
  ]
})
class MyApp {
  rootPage: any;
  isLoggedIn: () => boolean;
  pages: Array<{title: string, authorizedRoles?: string[], component: any}>;

  constructor(private app: IonicApp, private platform: Platform, private menu: MenuController,
              private AuthService: AuthService) {
    this.rootPage = Dashboard;
    this.isLoggedIn = () => this.AuthService.isAuthenticated();
    this.initializeApp();

    // set our app's pages
    this.pages = [
      {title: 'Dashboard', component: Dashboard},
      {title: 'Coffee-Coins', authorizedRoles: ["ROLE_ADMIN"], component: CoffeeCoin},
      {title: 'Studenten', authorizedRoles: ["ROLE_ADMIN"], component: Students},
      {title: 'Profil Einstellungen', authorizedRoles: ["ROLE_USER"], component: ProfileSettingsPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    nav.setRoot(page);
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
