import {Page, NavController} from "ionic-angular/index";
import {WebSocketService} from "../../../base/websocket-service";
import {Students} from "../students";
import {HttpService} from "../../../shared/services/httpService";
import {ControlGroup, AbstractControl, Control, FormBuilder, Validators} from "@angular/common";

@Page({
  templateUrl: 'build/pages/students/add/add.html',
  providers: [HttpService]
})
export class AddStudent {

  studentForm: ControlGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  hskaId: AbstractControl;
  password: AbstractControl;
  campusCardId: Control;

  constructor(private WebSocketService: WebSocketService, private FormBuilder: FormBuilder,
              private nav: NavController, private HttpService: HttpService) {
    this.createForm();
    this.connect();
    this.subscribeToWebsocket();
  }

  private connect() {
    let url: string;
    if (window.location.hostname === "localhost") {
      url = "ws://localhost:8080/campuscard";
    } else {
      url = "wss://smartcoffee.event-news.org/campuscard";
    }
    this.WebSocketService.connect(url);
  }

  private subscribeToWebsocket() {
    this.WebSocketService.subscribe((msg) => {
      console.debug("GETTING WEBSOCKET DATA: '" + msg + "'");
      this.campusCardId.updateValue(msg);
    });
  }

  private createForm() {
    this.studentForm = this.FormBuilder.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'hskaId': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      'password': ['', Validators.required],
      'campusCardId': ['', Validators.required]
    });

    this.firstName = this.studentForm.controls['firstName'];
    this.lastName = this.studentForm.controls['lastName'];
    this.hskaId = this.studentForm.controls['hskaId'];
    this.password = this.studentForm.controls['password'];
    this.campusCardId = <Control>this.studentForm.controls['campusCardId'];
  }

  addStudent(formData) {
    this.HttpService.addStudent(formData).then(
      (student) => this.nav.setRoot(Students),
      (err) => console.log(err)
    )
  }
}
