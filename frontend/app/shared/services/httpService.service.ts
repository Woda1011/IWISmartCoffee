import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/Rx';
import {Storage, LocalStorage} from "ionic-angular";
import {Credentials, User} from "../../_typings";
import {CookieService} from 'angular2-cookie/core';


@Injectable()
export class ProfileSettingsService {

  constructor(private http: Http, private CookieService: CookieService) {
  }

  /*
    ToDo: Hier weitere Zugriffe auf restservice realsiieren /Zusammenfassen
   */

}
