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
  private searchQuery;

  constructor(private nav: NavController, private HttpService: HttpService) {
    this.searchQuery = '';
    this.loadStudents();
  }

  addStudent() {
    this.nav.push(AddStudent);
  }

  private loadStudents(searchbar?) {
    this.HttpService.getStudents(searchbar ? searchbar.value : undefined).subscribe(
      (students: Student[]) => this.students = students
    )
  }
}
