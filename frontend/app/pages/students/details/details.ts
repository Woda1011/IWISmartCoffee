import {Page, NavController, NavParams} from "ionic-angular/index";
import {WebSocketService} from "../../../base/websocket-service";
import {Students} from "../students";
import {HttpService} from "../../../shared/services/httpService";
import {Student} from "../../../_typings";
import {ControlGroup, Control, FormBuilder, Validators} from "@angular/common";

@Page({
  templateUrl: 'build/pages/students/details/details.html',
  providers: [HttpService]
})
export class StudentDetails {

  campusCardForm: ControlGroup;
  firstName: Control;
  lastName: Control;
  hskaId: Control;
  campusCardId: Control;
  private student: Student;

  constructor(private WebSocketService: WebSocketService, private FormBuilder: FormBuilder,
              private navParams: NavParams, private nav: NavController, private HttpService: HttpService) {
    this.loadStudent();
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
    this.campusCardForm = this.FormBuilder.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'hskaId': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      'campusCardId': ['', Validators.required]
    });

    this.firstName = <Control>this.campusCardForm.controls['firstName'];
    this.lastName = <Control>this.campusCardForm.controls['lastName'];
    this.hskaId = <Control>this.campusCardForm.controls['hskaId'];
    this.campusCardId = <Control>this.campusCardForm.controls['campusCardId'];
  }

  private loadStudent() {
    this.HttpService.getStudentByHskaId(this.navParams.get('hskaId')).then(
      (student: Student) => {
        this.student = student;
        this.firstName.updateValue(student.firstName);
        this.lastName.updateValue(student.lastName);
        this.hskaId.updateValue(student.hskaId);
        this.campusCardId.updateValue(student.campusCardId)
      }
    );
  }

  updateStudent(formData) {
    formData.roles = this.student.roles;
    this.HttpService.updateStudent(formData).then(
      (student) => this.nav.setRoot(Students)
    );
  }
}
