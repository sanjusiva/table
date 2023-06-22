import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { CformComponent } from '../shared/cform/cform.component';
import { FormlyService } from '../shared/cform/formly.service';
import { ConfirmationboxComponent } from '../shared/confirmationbox/confirmationbox.component';
import { TableService } from '../shared/ctable/table.service';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { FilterBoxComponent } from '../shared/filter-box/filter-box.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnChanges {
  // displayedColumns = ['position', 'name', 'weight', 'symbol','category'];
  dataSource!:MatTableDataSource<any>;
  // selected: any;
  // filterBy = new FormControl('');
  formValue: FormlyFieldConfig[]=[];
  totalRows: number = 0;
  // paginator: any;
  EmpData: any;
  ColHeader: Array<string>=[];
  formData!: FormGroup;
  dialogRef!: MatDialogRef<any, any>;

  // @Output() tableData: EventEmitter<any> = new EventEmitter<any>();
  paginator!: MatPaginator;
  
  // @Output() closedialog : EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public http: HttpClient,
    public tservice: TableService,
    public fservice: FormlyService,
    public dialog: MatDialog
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.fservice.getFormFieldValues().subscribe((res: any) => {
      this.formValue = res;
      console.log('formValue: ', this.formValue);
    });
    this.refresh();
   
  }

  refresh(){
    console.log("refresh(): ",this.paginator);
    
    this.tservice.pagination().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<ele>(res);
      console.log('data: ', this.dataSource);
    });
    this.tservice.getTableData().subscribe((res: any) => {
      this.totalRows = res.length;
      console.log('data length: ', this.totalRows);
    });
  }

  deleteDataFunc(event: any) {
    if (event['type'] == 'box') {
      console.log('parent del id: ', event['id']);
      this.dialogRef = this.dialog.open(ConfirmationboxComponent, {
        height: '400px',
        width: '600px',
        data: {
          callbackAction: this.callbackAction.bind(this),
          id: event['id'],
          content: 'Are you sure?',
        },
      });
      console.log('res of dialog: ', this.formData);
      this.dialogRef.disableClose = true;
      this.dialogRef.backdropClick().subscribe(() => {
        let cn = confirm('Sure ?');
        if (cn) {
          this.dialogRef.close();
        }
      });
    }
  }
  callbackAction(action: any) {
    console.log('parent action: ', action['Action']);
    if (action['Action'] == true) {
      this.tservice.deleteTableData(action['id']).subscribe((res: any) => {
        console.log(res['message']);
        alert(res['message']);
        this.dialogRef.afterClosed().subscribe((result: any) => {
          console.log('The dialog was closed: ', result);
        });
      this.editDelOnSamePage(this.paginator);
      });
    }
    this.dialogRef.close();
    this.refresh();
  }
  callBack(data: any) {
    console.log('return data: ', data.id);
    if (data['method'] == 'post') {
      this.fservice.postFormValues(data['model']).subscribe((res: any) => {
        console.log('post res: ', res);

        if (res.status == 200) {
          alert('success');
         
        }
      this.dialogRef.close();
      // this.refresh();
      this.editDelOnSamePage(this.paginator);

        this.dialogRef.afterClosed().subscribe((result: any) => {
          console.log('The dialog was closed: ', result);
        });
      });
    } else if (data['method'] == 'put') {
      console.log('put: ',data['model']);
      
      this.fservice
        // .putFormValues(data['model']['_id'], data['model'])
        .putFormValues(data.id, data['model'])

        .subscribe((res: any) => {
          console.log('put res: ', res);
          if (res.status == 202) {
            alert('success');
            this.dialogRef.afterClosed().subscribe((result: any) => {
              console.log('The dialog was closed: ', result);
            });
          }
      this.dialogRef.close();
      console.log("page: ",this.paginator);
      this.editDelOnSamePage(this.paginator);
      
        });
    }
  }

  callbackFilter(){

  }

  filterDialogOpenFunc(event:any){
    console.log("filter event: ",event.fieldName);
    this.dialogRef = this.dialog.open(FilterBoxComponent, {
      height: '400px',
      width: '600px',
      data: {
        callbackFilter: this.callbackFilter.bind(this),
        fieldName: event.fieldName,
      },
    });
    this.dialogRef.disableClose = true;
      this.dialogRef.backdropClick().subscribe(() => {
        let cn = confirm('Sure ?');
        if (cn) {
          this.dialogRef.close();
        }
      });
  }

  sortDataFunc(event:Event){
    console.log("parent sort: ",event);
    console.log('parent sort pagination: ',this.paginator)
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          console.log('switchMap: ');
          return this.getSortTableData$(this.paginator.pageIndex + 1, this.paginator.pageSize,event).pipe(
            catchError(() => of(null))
          );
        }),
        map((empData: any) => {
          console.log('map: ', empData);

          if (empData == null) return [];
          console.log('ed: ', empData);
          console.log('total Data in parent: ', this.totalRows);
          console.log('emm: ', empData);
          this.dataSource = empData;
          console.log('emmqq: ', this.dataSource);
          return empData;
        })
      )
      .subscribe((empData: any) => {
        this.EmpData = empData;
        console.log('final: ', empData);
        this.dataSource = new MatTableDataSource(this.EmpData);
        console.log('final o final in parent: ', this.dataSource);
        this.ColHeader = Object.keys(this.dataSource.filteredData[0]).filter(
          (ele: any) => {
            if (ele != '_id') {
              return ele;
            }
          }
        );
        this.ColHeader.push('Action');
        console.log('ch: ', this.ColHeader);
      });
  }

  dialogOpenDataFunc(event: any) {
    console.log('e: ', event);
    console.log('dodf: ', event['type']);
    if (event['id']) {
      this.fservice.getFormfieldbyid(event['id']).subscribe((res: any) => {
        this.formData = res[0];
        this.dialogRef = this.dialog.open(DialogComponent, {
          // height: '400px',
          // width: '600px',
          data: {
            callback: this.callBack.bind(this),
            id: event['id'],
            formValue: this.formValue,
            form: this.formData,
          },
        });

        console.log('res of dialog: ', this.formValue);
        console.log('res of dialog1: ', this.formData);
        this.dialogRef.disableClose = true;
        console.log('close: ', this.dialogRef.disableClose);

        this.dialogRef.backdropClick().subscribe(() => {
          let cn = confirm('Sure ?');
          if (cn) {
            this.dialogRef.close();
          }
        });
      });
    } else {
      this.dialogRef = this.dialog.open(DialogComponent, {
        height: '400px',
        width: '600px',
        data: { callback: this.callBack.bind(this), formValue: this.formValue,form:'undefined' },
      });
      console.log('res of dialog: ', this.formValue);
      this.dialogRef.disableClose = true;
      this.dialogRef.backdropClick().subscribe(() => {
        let cn = confirm('Sure ?');
        console.log("cn: ",cn);
        if (cn) {
          this.dialogRef.close();
        }
      });
    }
  }

  paginationFunc(event: any): any {
    console.log('event: ', event);
    this.paginator=event;
    event.page
      .pipe(
        startWith({}),
        switchMap(() => {
          console.log('switchMap: ');
          return this.getTableData$(event.pageIndex + 1, event.pageSize).pipe(
            catchError(() => of(null))
          );
        }),
        map((empData: any) => {
          console.log('map: ', empData);

          if (empData == null) return [];
          // this.totalRows = 20;
          console.log('ed: ', empData);
          console.log('total Data in parent: ', this.totalRows);
          console.log('emm: ', empData);
          this.dataSource = empData;
          console.log('emmqq: ', this.dataSource);
          // this.tableData.emit(empData);

          return empData;
        })
      )
      .subscribe((empData: any) => {
        this.EmpData = empData;
        console.log('final: ', empData);
        this.dataSource = new MatTableDataSource(this.EmpData);
        console.log('final o final in parent: ', this.dataSource);
        this.ColHeader = Object.keys(this.dataSource.filteredData[0]).filter(
          (ele: any) => {
            if (ele != '_id') {
              return ele;
            }
          }
        );
        this.ColHeader.push('Action');
        console.log('ch: ', this.ColHeader);
      });
  }
  editDelOnSamePage(event:any){
    event.page
      .pipe(
        startWith({}),
        switchMap(() => {
          console.log('switchMap: ');
          return this.getTableData$(event.pageIndex + 1, event.pageSize).pipe(
            catchError(() => of(null))
          );
        }),
        map((empData: any) => {
          console.log('map: ', empData);

          if (empData == null) return [];
          // this.totalRows = 20;
          console.log('ed del/edit: ', empData);
          this.tservice.getTableData().subscribe((res: any) => {
            this.totalRows = res.length;
            console.log('data length: ', this.totalRows);
          });
          console.log('total Data in parent: ', this.totalRows);
          console.log('emm: ', empData);
          this.dataSource = empData;
          console.log('emmqq: ', this.dataSource);
          // this.tableData.emit(empData);

          return empData;
        })
      )
      .subscribe((empData: any) => {
        this.EmpData = empData;
        console.log('final: ', empData);
        this.dataSource = new MatTableDataSource(this.EmpData);
        console.log('final o final in parent: ', this.dataSource);
        this.ColHeader = Object.keys(this.dataSource.filteredData[0]).filter(
          (ele: any) => {
            if (ele != '_id') {
              return ele;
            }
          }
        );
        this.ColHeader.push('Action');
        console.log('ch: ', this.ColHeader);
      });
  }
  getTableData$(pageNumber: Number, pageSize: Number) {
    console.log('no: ', pageNumber, ' size: ', pageSize);
    return this.tservice.pagination(pageNumber, pageSize);
  }

  getSortTableData$(pageNumber: Number, pageSize: Number,event:any) {
    console.log('no1: ', pageNumber, ' size1: ', pageSize);
    return this.tservice.sortHeader(pageNumber, pageSize,event);
  }

}
export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  category: string;
}

export interface ele {
  securityType: string;
  Description: string;
  Category: string;
}

const ELEMENT_DATA: Element[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    category: 'Fixed',
  },
  {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    category: 'Fixed',
  },
  {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    category: 'Fixed',
  },
  {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    category: 'Variable',
  },
];

const TABLE_DATA: ele[] = [
  {
    securityType: 'ABCD',
    Description: 'Random description 1',
    Category: 'ADJ',
  },
  {
    securityType: 'WXYZ',
    Description: 'Random description 2',
    Category: 'FIXED',
  },
  {
    securityType: 'PQRS',
    Description: 'Random description 3',
    Category: 'ADJ',
  },
  {
    securityType: 'LMNO',
    Description: 'Random description 4',
    Category: 'FIXED',
  },
  {
    securityType: 'QRST',
    Description: 'Random description 5',
    Category: 'ADJ',
  },
  {
    securityType: 'WXYZ',
    Description: 'Random description 6',
    Category: 'FIXED',
  },
  {
    securityType: 'ABCD',
    Description: 'Random description 7',
    Category: 'ADJ',
  },
  {
    securityType: 'LMNO',
    Description: 'Random description 8',
    Category: 'FIXED',
  },
  {
    securityType: 'QRST',
    Description: 'Random description 9',
    Category: 'ADJ',
  },
  {
    securityType: 'WXYZ',
    Description: 'Random description 10',
    Category: 'FIXED',
  },
  {
    securityType: 'ABCD',
    Description: 'Random description 11',
    Category: 'ADJ',
  },
  {
    securityType: 'LMNO',
    Description: 'Random description 12',
    Category: 'FIXED',
  },
  {
    securityType: 'QRST',
    Description: 'Random description 13',
    Category: 'ADJ',
  },
  {
    securityType: 'WXYZ',
    Description: 'Random description 14',
    Category: 'FIXED',
  },
  {
    securityType: 'ABCD',
    Description: 'Random description 15',
    Category: 'ADJ',
  },
  {
    securityType: 'LMNO',
    Description: 'Random description 16',
    Category: 'FIXED',
  },
  {
    securityType: 'QRST',
    Description: 'Random description 17',
    Category: 'ADJ',
  },
  {
    securityType: 'WXYZ',
    Description: 'Random description 18',
    Category: 'FIXED',
  },
  {
    securityType: 'ABCD',
    Description: 'Random description 19',
    Category: 'ADJ',
  },
  {
    securityType: 'LMNO',
    Description: 'Random description 20',
    Category: 'FIXED',
  },
];
