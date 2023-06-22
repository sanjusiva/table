import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyService } from './formly.service';

@Component({
  selector: 'app-cform',
  templateUrl: './cform.component.html',
  styleUrls: ['./cform.component.scss'],
})
export class CformComponent implements OnInit {
  @Input() formValue!: FormlyFieldConfig[];
  @Input() form!: any;
  @Output() submitValData: EventEmitter<any> = new EventEmitter<any>();

  id:any;

  constructor() {
  }
  ngOnInit(): void {
    console.log('cform: ',this.form?._id);
    
    if(this.form?._id){
      this.id=this.form._id
      console.log('ppaaa: ', this.form._id);
      console.log('cform e: ',this.form);

      //Attaching default value to formly
      this.formValue.map((ele:any)=>{
        console.log('cform ele: ',this.form[ele.key]);
        ele.defaultValue=this.form[ele.key]
        
      })
      console.log('cform ',this.formValue);
      
      //simply patching the values
      // this.model=this.form
    }
    else{
      this.formValue.map((ele:any)=>{
        console.log('cform ele: ',this.form[ele.key]);
        ele.defaultValue='';
        
      })
      console.log('cform ',this.formValue);
    }
  }

  form1 = new FormGroup({});
  model = { };

  onSubmit(model: any) {
    console.log('model: ', model);
    if(this.id){
     this.submitValData.emit({model,method:'put',id:this.id});
    }
    else{
     this.submitValData.emit({model,method:'post'});

    }
  }
}
