import {Page, NavController} from "ionic-angular/index";
import {ControlGroup, AbstractControl, Validators, FormBuilder, Control} from "angular2/common";
import {HttpService} from "../../shared/services/httpService";
import {LoginPage} from "../login/login";
import {GoogleRecaptchaDirective} from "../../../node_modules/angular2-google-recaptcha/directives/googlerecaptcha.directive";

@Page({
  templateUrl: 'build/pages/register/register.html',
  providers: [HttpService],
  directives: [GoogleRecaptchaDirective]
})
export class RegisterPage {

  registerForm: ControlGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  hskaId: AbstractControl;
  password: AbstractControl;
  passwordRepeat: AbstractControl;
  noRobot: Control;
  public siteKey: string = "6Lcy5yETAAAAAKEt40vOlMEsFEh9CFsfIzyrEagF";//example: 6LdEnxQTfkdldc-Wa6iKZSelks823exsdcjX7A-N
  public theme: string = "light";//you can give any google themes light or dark

  constructor(private HttpService: HttpService, private FormBuilder: FormBuilder, private nav: NavController) {
    this.registerForm = FormBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      hskaId: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      noRobot: [false, this.checkNoRobot],
      passwordMatch: FormBuilder.group({
        password: ['', Validators.required],
        passwordRepeat: ['', Validators.required]
      }, {validator: this.areEqual})
    });

    this.firstName = this.registerForm.controls['firstName'];
    this.lastName = this.registerForm.controls['lastName'];
    this.hskaId = this.registerForm.controls['hskaId'];
    this.noRobot = <Control>this.registerForm.controls['noRobot'];
    this.password = this.registerForm.controls['password'];
    this.passwordRepeat = this.registerForm.controls['passwordRepeat'];
  }

  checkNoRobot(c: Control) {
    return c.value ? null : {
      checkNoRobot: {
        valid: true
      }
    };
  }

  areEqual(group: ControlGroup) {
    let val;
    let valid = true;

    for (name in group.controls) {
      if (val === undefined) {
        val = group.controls[name].value
      } else {
        if (val !== group.controls[name].value) {
          valid = false;
          break;
        }
      }
    }

    return valid ? null : {
      areEqual: true
    };
  }

  register(formData) {
    formData.password = formData.passwordMatch.password;
    this.HttpService.addStudent(formData).subscribe(
      (student) => this.nav.setRoot(LoginPage, {hskaId: student.hskaId}),
      (err) => console.log(err)
    )
  }

  setVerified(data) {
    if (data) {
      this.noRobot.updateValue(true);
    }
  }
}
