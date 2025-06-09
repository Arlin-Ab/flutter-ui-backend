import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { Class1ListComponent } from './pages/class1/class1-list.component';
import { Class1FormComponent } from './pages/class1/class1-form.component';

import { Class2ListComponent } from './pages/class2/class2-list.component';
import { Class2FormComponent } from './pages/class2/class2-form.component';

import { Class3ListComponent } from './pages/class3/class3-list.component';
import { Class3FormComponent } from './pages/class3/class3-form.component';


const routes: Routes = [
  
  { path: 'class1s', component: Class1ListComponent },
  { path: 'class1/new', component: Class1FormComponent },
  { path: 'class1/:id', component: Class1FormComponent },
  
  { path: 'class2s', component: Class2ListComponent },
  { path: 'class2/new', component: Class2FormComponent },
  { path: 'class2/:id', component: Class2FormComponent },
  
  { path: 'class3s', component: Class3ListComponent },
  { path: 'class3/new', component: Class3FormComponent },
  { path: 'class3/:id', component: Class3FormComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }