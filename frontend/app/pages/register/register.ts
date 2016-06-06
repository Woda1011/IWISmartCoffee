import {Page, NavController} from "ionic-angular/index";
import {ControlGroup, AbstractControl, Validators, FormBuilder} from "angular2/common";
import {HttpService} from "../../shared/services/httpService";
import {LoginPage} from "../login/login";

@Page({
  templateUrl: 'build/pages/register/register.html',
  providers: [HttpService]
})
export class RegisterPage {

  registerForm: ControlGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  hskaId: AbstractControl;
  password: AbstractControl;
  passwordRepeat: AbstractControl;

  constructor(private HttpService: HttpService, private FormBuilder: FormBuilder, private nav: NavController) {
    this.registerForm = FormBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      hskaId: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      passwordMatch: FormBuilder.group({
        password: ['', Validators.required],
        passwordRepeat: ['', Validators.required]
      }, {validator: this.areEqual})
    });

    this.firstName = this.registerForm.controls['firstName'];
    this.lastName = this.registerForm.controls['lastName'];
    this.hskaId = this.registerForm.controls['hskaId'];
    this.password = this.registerForm.controls['password'];
    this.passwordRepeat = this.registerForm.controls['passwordRepeat'];
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

    if (valid) {
      return null;
    }

    return {
      areEqual: true
    };
  }

  register(formData) {
    formData.password = formData.passwordMatch.password;
    this.HttpService.addStudent(formData).subscribe(
      (student) => this.nav.setRoot(LoginPage),
      (err) => console.log(err)
    )
  }
}
