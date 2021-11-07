import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllCourseComponent } from './all-course.component';

import { CourseComponent } from './course.component';
import { LessionComponent } from './lession.component';
import { AuthGuard, PermissionGuard } from '@abp/ng.core';
import { WordComponent } from './word.component';
import { LearnComponent } from './learn/learn.component';
import { TestComponent } from './test/test.component';

const routes: Routes =
[

  { path: 'course', component: CourseComponent},
  { path: '', component: AllCourseComponent},
  { path: 'course/:nameCourse/:idcourse', component: LessionComponent, canActivate: [AuthGuard]},
  { path: ':nameCourse/:idcourse', component: LessionComponent, canActivate: [AuthGuard]},
  { path: 'course/:nameCourse/:idcourse/lession/:nameLession/:idLession', component: WordComponent, canActivate: [AuthGuard]},
  { path: ':nameCourse/:idcourse/lession/:nameLession/:idLession', component: WordComponent,  canActivate: [AuthGuard]},
  { path: 'course/:nameCourse/:idcourse/lession/:nameLession/:idLession/learn', component: LearnComponent,  canActivate: [AuthGuard]},
  { path: ':nameCourse/:idcourse/test', component: TestComponent,  canActivate: [AuthGuard]}



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
