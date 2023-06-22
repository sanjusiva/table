import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export type DialogDataSubmitCallbackFilter<T> = (row: T) => void;


@Component({
  selector: 'app-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { fieldName: any}){
    console.log('box: ',this.data.fieldName);
  }
}
