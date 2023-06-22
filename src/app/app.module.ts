import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { MatTableModule } from "@angular/material/table";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CtableComponent } from './shared/ctable/ctable.component';
import { HttpClientModule } from "@angular/common/http";
import { CformComponent } from './shared/cform/cform.component';
import { FormlyModule } from '@ngx-formly/core'
// import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from './shared/dialog/dialog.component'
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort'
import { ConfirmationboxComponent } from './shared/confirmationbox/confirmationbox.component';
import { FilterBoxComponent } from './shared/filter-box/filter-box.component'

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    CtableComponent,
    CformComponent,
    DialogComponent,
    ConfirmationboxComponent,
    FilterBoxComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
