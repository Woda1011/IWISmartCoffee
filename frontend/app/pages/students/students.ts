import {Page, NavController} from "ionic-angular/index";
import {AddStudent} from "./add/add";
import {Student} from "../../_typings";
import {HttpService} from "../../shared/services/httpService";

@Page({
  templateUrl: 'build/pages/students/students.html',
  providers: [HttpService]
})
export class Students {

  private students: Student[];

  constructor(private nav: NavController, private HttpService: HttpService) {
    this.loadStudents();
  }

  addStudent() {
    this.nav.push(AddStudent);
  }

  private loadStudents() {
    this.HttpService.getStudents().subscribe(
      (students: Student[]) => this.students = students
    )
  }
}
