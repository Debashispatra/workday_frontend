import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { AllModulesData } from "src/assets/all-modules-data/all-modules-data";
import { id } from "src/assets/all-modules-data/id";

@Injectable({
  providedIn: "root",
})
export class AllModulesService {
  // Chats
  
  groups = {
    active: "",
    total: ["general", "video responsive survey", "500rs", "warehouse"],
  };
  members = {
    active: "Mike Litorus",
    total: [
      { name: "John Doe", count: 3 },
      { name: "Richard Miles", count: 0 },
      { name: "John Smith", count: 7 },
      { name: "Mike Litorus", count: 9 },
    ],
  };

  // Api Methods for All modules

  public apiurl;

  // Headers Setup
  headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");
  httpOptions = {
    headers: this.headers,
  };
  
 baseurl="http://localhost/4000/api/"
  constructor(private http: HttpClient) {}

  // Handling Errors
  private handleError(error: any) {
    return throwError(error);
  }

  // Get Method Api
  get(type): Observable<AllModulesData[]> {
    this.apiurl = `api/${type}`;

    return this.http
      .get<AllModulesData[]>(this.apiurl)
      .pipe(tap(), catchError(this.handleError));
  }

 getall(){
   return this.http.get<any>("/api/holiday/holiday_get")
 }


  // Post Method Api
  add(user: any, type): Observable<any> {
    // this.apiurl=`http://localhost/4000/api/holiday/insert`;
    user.id = null;
    return this.http
      .post<any>(this.baseurl, user, this.httpOptions)
      .pipe(tap(), catchError(this.handleError));
  }
  
  addholiday(payload:any) {
    return this.http.post('/api/holiday/holiday_insert',payload)
  }

  // Update Method Api
  update(user: any, type): Observable<any> {
    this.apiurl = `api/${type}`;
    const url = `${this.apiurl}/${user.id}`;
    return this.http.put<any>(url, user, this.httpOptions).pipe(
      map(() => user),
      catchError(this.handleError)
    );
  }

  // Delete Method Api
  delete(id: id, type): Observable<id> {
    this.apiurl = `api/${type}`;
    const url = `${this.apiurl}/${id}`;
    return this.http
      .delete<id>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteholiday(id:any){
    return this.http.delete(`/api/holiday/holiday_delete/${id}`)
  }
  getoneholiday(id:any){
    return this.http.get(`/api/holiday/getone/${id}`)
  }
  updateholiday(id: any, payload: any) {
    return this.http.put(`/api/holiday/holiday_update/${id}`, payload)
  }
  login(payload: any) {
    console.log(payload)
    return this.http.post(`http://localhost:7070/login`, payload)
  }
}
