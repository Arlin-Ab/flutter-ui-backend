import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';


import { Class1ListComponent } from './pages/class1/class1-list.component';
import { Class1FormComponent } from './pages/class1/class1-form.component';

import { Class2ListComponent } from './pages/class2/class2-list.component';
import { Class2FormComponent } from './pages/class2/class2-form.component';

import { Class3ListComponent } from './pages/class3/class3-list.component';
import { Class3FormComponent } from './pages/class3/class3-form.component';


@NgModule({
  declarations: [
    AppComponent,
    
    Class1ListComponent,
    Class1FormComponent,
    
    Class2ListComponent,
    Class2FormComponent,
    
    Class3ListComponent,
    Class3FormComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }