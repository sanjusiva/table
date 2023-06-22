import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export type DialogDataSubmitCallbackAction<T> = (row: T) => void;

@Component({
  selector: 'app-confirmationbox',
  templateUrl: './confirmationbox.component.html',
  styleUrls: ['./confirmationbox.component.scss']
})
export class ConfirmationboxComponent {
    
    constructor(@Inject(MAT_DIALOG_DATA) public data: { callbackAction: DialogDataSubmitCallbackAction<any>; id: string,content: any}){
      console.log("cb: ",this.data.id);
      
    }
    actionFunc(action:boolean){
      console.log("action: ",action);
      this.data.callbackAction({Action:action,id:this.data.id})
    }
}
