import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NewPromiseComponent } from './pages/new-promise/new-promise.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: '/new-promise',
    pathMatch: 'full',
  },
  {
    path: 'new-promise',
    component: NewPromiseComponent
  }
];

const imports = [
  CommonModule,
  RouterModule.forRoot(routes),
];

const declarations = [];

const providers = [
];

@NgModule({
  imports: [ ...imports ],
  declarations: [ ...declarations ],
  providers: [ ...providers ],
  exports: [ RouterModule ],
})

export class AppRouterModule {}
