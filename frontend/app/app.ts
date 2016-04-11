import {App, IonicApp, Platform, MenuController} from 'ionic-angular';
import {CookieService} from 'angular2-cookie/core';
import {Dashboard} from './pages/dashboard/dashboard';
import {ListPage} from './pages/list/list';
import {ProfileSettingsPage} from "./pages/profile-settings/profile-settings";
import {LoginPage} from "./pages/login/login";
import {AuthService} from "./base/auth";


@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [AuthService, CookieService]
})
class MyApp {
  rootPage: any;
  private isLoggedIn: () => boolean;
  pages: Array<{title: string, authorizedRoles?: string[], component: any}>;

  constructor(private app: IonicApp, private platform: Platform, private menu: MenuController,
              private AuthService: AuthService) {
    this.rootPage = this.AuthService.getStudent() ? Dashboard : LoginPage;
    this.isLoggedIn = () => this.AuthService.isAuthenticated();
    this.initializeApp();

    // set our app's pages
    this.pages = [
      {title: 'Dashboard', authorizedRoles: ["ROLE_USER"], component: Dashboard},
      {title: '*Testseite', authorizedRoles: ["ROLE_ADMIN"], component: ListPage},
      {title: 'Profil Einstellungen', authorizedRoles: ["ROLE_ADMIN"], component: ProfileSettingsPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {});
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }

  isVisible(roles: string[]) {
    return this.AuthService.isAuthorized(roles);
  }

  logout() {
    this.AuthService.logout().then(() => this.openPage({component: LoginPage}));
  }
}
