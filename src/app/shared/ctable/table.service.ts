import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ele} from '../model/index'

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(public http:HttpClient) { }

  getTableData(){
    return this.http.get('http://localhost:3000/tables')
  }
  deleteTableData(id:any){
    console.log("service del id: ",id);
    return this.http.delete(`http://localhost:3000/del?id=${id}`)
  }

  pagination(pageNo?:any,size?:any):Observable<any>{
    const pageNumber=pageNo?pageNo:1;
    const pageSize=size?size:5;
    console.log("No: ",pageNumber," size: ",pageSize);
    console.log('return: ',this.http.get(`http://localhost:3000/page/${pageNumber}/${pageSize}`));
    
    return this.http.get(`http://localhost:3000/page/${pageNumber}/${pageSize}`)
  }
  sortPage(pageNo?:any,size?:any){
    console.log("No: ",pageNo," size: ",size);
    return this.http.get(`http://localhost:3000/sort/${pageNo}/${size}`)
  }
  sortHeader(pageNo:any,size:any,data:any){
    console.log("service: ",data.active,data.direction);
    
    return this.http.get(`http://localhost:3000/sort?active=${data.active}&direction=${data.direction}&pageNo=${pageNo}&size=${size}`)
  }

  // public getEmployees(
  //   pageNumber: Number,
  //   pageSize: Number
  // ){
  //   const url = `http://localhost:3000/page/${pageNumber}/${pageSize}`;

  //   return this.http.get<ele>(url);
  // }
  
}
