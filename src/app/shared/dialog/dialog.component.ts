import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyService } from '../cform/formly.service';

export type DialogDataSubmitCallback<T> = (row: T) => void;


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, OnChanges {
  modal:any;
  form:any;
  dialogBoxStatus:boolean=false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { callback: DialogDataSubmitCallback<any>; id: string,formValue: FormlyFieldConfig[],form:any }
  ) {
    if(this.data.id){
    console.log("achieved: ",this.data.form);
    
    this.formValue=this.data.formValue
  }
  else{
    this.formValue=this.data.formValue
  }
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  model = {};
  formValue!: FormlyFieldConfig[];
  ngOnInit(): void {
this.form=this.data.form
console.log("mmoo: ",this.form);

    console.log('id: ', this.data.id);
    if (this.data.id) {
      console.log("id inside");
      
    }
  }
  closeDialogFunc() {
    this.dialogBoxStatus=true
    console.log('event of dialog: ', this.dialogBoxStatus);
  }
  submitValDataFunc(event:any){
    console.log('event of submit: ',event);
    this.modal=event;
    this.data.callback(this.modal)
  }
}
