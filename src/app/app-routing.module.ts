import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadFileSecretComponent } from './load-file-secret/load-file-secret.component';
import { ProfilesComponent } from './profiles/profiles.component';

const routes: Routes = [
  { path: '', component: LoadFileSecretComponent },
  { path: 'profiles', component: ProfilesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
