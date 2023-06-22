import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { ele } from '../model/formField.model';
import { TableService } from './table.service';


@Component({
  selector: 'app-ctable',
  templateUrl: './ctable.component.html',
  styleUrls: ['./ctable.component.scss']
})
export class CtableComponent implements OnChanges{
  ColNo:number=0;
  dataSource! : MatTableDataSource<any>;
  pageSize= [5, 10, 15, 20];  

  @Input() sharedDataSource!:MatTableDataSource<any>;
  @Input() totalRows!:number;
  @Input() ColHeader:any
  @ViewChild('paginator') paginator!: MatPaginator;
  @Output() paginationData : EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteData: EventEmitter<any> = new EventEmitter<any>();
  @Output() dialogOpenData: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterDialogOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() sortData: EventEmitter<any> = new EventEmitter<any>();


  constructor(public http:HttpClient,public dialog:MatDialog ){}
  
 
  ngOnChanges(changes: SimpleChanges): void {
    console.log('total Rows',this.totalRows);
    console.log("sd: ",this.sharedDataSource);
   console.log("chc: ",this.ColHeader);
   this.dataSource=this.sharedDataSource;
   
  }
  sortDataFunc(event:any){
    console.log("sort: ",event);
    this.sortData.emit(event);
  }

  openDialog(id?:any): void {
    console.log("odid: ",id);
      this.dialogOpenData.emit({id,type:'form'})
  }

  DeleteField(id:any){
    console.log("del id: ",id);
    this.deleteData.emit({id,type:'box'});
  }

  ngAfterViewInit() {
    console.log("afterViewInit: ",this.paginator);
    this.paginationData.emit(this.paginator)
  }

  openFilter(){
    console.log("filter");
    this.filterDialogOpen.emit({type:'filter',fieldName:'Category'})
  }


}

