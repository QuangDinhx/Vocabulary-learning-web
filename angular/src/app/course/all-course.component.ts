import { Component, OnInit } from '@angular/core';
import { ServerHttpService } from '../CourseService/server-http.service';
import { ServerHttpService as Permission } from '../CoursePermission/server-http.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-all-course',
  templateUrl: './all-course.component.html',
  styleUrls: ['./course.component.scss']
})
export class AllCourseComponent implements OnInit {
  AllCourses: [];
  page = 1;
  pageSize = 5;
  checkRes: number;
  searchForm: FormGroup;
  isSearch: boolean;
  orderName: number;
  orderPrice: number;
  pageOfItem: Array<any>;
  constructor(private Service: ServerHttpService,
              private PermissionService: Permission,
              private dialog: MatDialog,
              private route: Router,
              private fb: FormBuilder
    ) {
  }

  ngOnInit(): void {
    this.isSearch = false;
    // this.Service.getAllCourses().subscribe((data=>{
    //   this.AllCourses = data.items;
    // }))
    this.searchForm = this.fb.group({
      name: ''
    });
  }
  public search(){
    if(this.orderName === undefined) {
      this.orderName = 0;
    }
    if(this.orderPrice === undefined) {
      this.orderPrice = 0;
    }
    this.Service.searchCourses(this.searchForm.controls.name.value, this.orderName, this.orderPrice).subscribe((data => {
      this.AllCourses = data.items;
    }));
    this.isSearch = true;
  }

  public check(id, name){
    this.PermissionService.checkPermission(id).subscribe((data =>{
      console.log(data);
      this.checkRes = data.result;
      if (this.checkRes === 2){
        this.route.navigateByUrl('courses/' + name + '/' + id);
      } else {
        this.PermissionService.idCourse = id;
        this.PermissionService.nameCourse = name;
        this.openDialog();
      }
    }));


  }

  public changeOrdername(orderName) {
        this.orderName = orderName;
        this.Service.searchCourses(this.searchForm.controls.name.value, this.orderName, this.orderPrice).subscribe((data => {
          this.AllCourses = data.items;
        }));
  }

  public changeOrderprice(orderPrice) {
    this.orderPrice = orderPrice;
    this.Service.searchCourses(this.searchForm.controls.name.value, this.orderName, this.orderPrice).subscribe((data => {
      this.AllCourses = data.items;
    }));

}

  public onChangePage( pageOfItem: Array<any> ) {
        this.pageOfItem = pageOfItem;
  }
  public openDialog(){
    this.dialog.open(CourseCheckPassComponent, {
      height: '300px' ,
      width: '500px'
    });
  }
}

@Component({
  selector: 'CourseCheckPassComponent',
  templateUrl: './CourseCheckPass.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseCheckPassComponent implements OnInit {
  form: FormGroup;
  hide = true;
  password: '';
  res;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private Service: Permission,
    private route: Router

  ){}
  ngOnInit(){
    this.form = this.fb.group({
      password: this.password
    })
  }
  public closeDialog() {
    this.dialog.closeAll();
  }

  public save(){
    this.Service.addPermission(this.Service.idCourse, this.form.controls.password.value).subscribe((data => {
      this.res = data.result;
      if (this.res == 2){
        this.route.navigateByUrl('courses/' + this.Service.nameCourse + '/' + this.Service.idCourse);
        this.closeDialog();
      } else {
        alert("sai m???t kh???u");
      }
    }));
  }
 }