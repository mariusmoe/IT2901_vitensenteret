import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageAdminComponent } from './admin/homepage-admin/homepage-admin.component';
import { CreateSurveyComponent } from './admin/create-survey/create-survey.component';
import { HomepageUserComponent } from './user/homepage-user/homepage-user.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './admin/login/login.component';
import { AdminOutletComponent } from './admin/admin-outlet/admin-outlet.component';
import { ChooseSurveyComponent } from './user/choose-survey/choose-survey.component';   
import { SurveyRetrievalComponent } from './admin/survey-retrieval/survey-retrieval.component';
import { AdminSettingsComponent } from './admin/admin-settings/admin-settings.component';

const appRoutes: Routes = [
  { path: '', component: HomepageUserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'choosesurvey', component: ChooseSurveyComponent },
  { path: 'admin', component: AdminOutletComponent, canActivate: [AuthGuard],

    children: [
      { path: 'settings', component: AdminSettingsComponent, canActivate: [AuthGuard] },
      { path: 'editsurvey', component: CreateSurveyComponent, canActivate: [AuthGuard] },
      { path: 'editsurvey/:surveyId', component: CreateSurveyComponent, canActivate: [AuthGuard] },
      // these two placed further down due to priority issues
      { path: '', component: HomepageAdminComponent, pathMatch: 'full', canActivate: [AuthGuard]   },
      { path: ':surveyId', component: HomepageAdminComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]
  },

  { path: '', component:HomepageUserComponent },
  { path:'survey-retrieval', component: SurveyRetrievalComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
 imports: [
   RouterModule.forRoot(appRoutes)
 ],
 exports: [
   RouterModule
 ]
})
export class AppRoutingModule {}
