import {App, IonicApp, Platform, MenuController} from 'ionic-angular';
import {CookieService} from 'angular2-cookie/core';
import {Dashboard} from './pages/dashboard/dashboard';
import {CoffeeCoin} from './pages/coffee-coin/coffee-coin';
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
    this.rootPage = this.AuthService.getUser() ? Dashboard : LoginPage;
    this.isLoggedIn = () => this.AuthService.isAuthenticated();
    this.initializeApp();

    // set our app's pages
    this.pages = [
      {title: 'Dashboard', authorizedRoles: ["ROLE_USER"], component: Dashboard},
      {title: 'Coffee-Coins', authorizedRoles: ["ROLE_ADMIN"], component: CoffeeCoin},
      {title: 'Profil Einstellungen', authorizedRoles: ["ROLE_USER"], component: ProfileSettingsPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    });
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
