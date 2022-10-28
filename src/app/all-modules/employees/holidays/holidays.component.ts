import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AllModulesService } from "../../all-modules.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { ActivatedRoute } from "@angular/router";
declare const $: any;
@Component({
  selector: "app-holidays",
  templateUrl: "./holidays.component.html",
  styleUrls: ["./holidays.component.css"],
})
export class HolidaysComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  lstHolidays:any[];
  url: any = "holidays";
  public tempId: any;
  public editId: any;
  readuser:any=[];
  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public pipe = new DatePipe("en-US");
  public addHolidayForm: FormGroup;
  public editHolidayForm: FormGroup;

  id: any='';
  editHolidayName:string ='';
  editHolidaydate:string ='';
  editDaysName:string ='';


  public editHolidayDate: any;
  load: any[];
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private route:ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadholiday1();

    // this.srvModuleService.getall().subscribe((data) => {
    //   this.readuser = data;
    // })
    this.addHolidayForm = this.formBuilder.group({
      HolidayName: ["", [Validators.required]],
      Holidaydate: ["", [Validators.required]],
      DaysName: ["", [Validators.required]],
    });

    // Edit Contact Form Validation And Getting Values
    this.edit1(this.route.snapshot.params['id']);
    this.editHolidayForm = this.formBuilder.group({
      HolidayName: ["", [Validators.required]],
      Holidaydate: ["", [Validators.required]],
      DaysName: ["", [Validators.required]],
    });
  }

  // Get Employee  Api Call
  loadholidays() {
    this.srvModuleService.get(this.url).subscribe((data) => {
      this.lstHolidays = data;
      
      // this.readuser=data
      this.dtTrigger.next();
      this.rows = this.lstHolidays;
      this.srch = [...this.rows];
    });
  }
  loadholiday1(){
    this.srvModuleService.getall().subscribe(data=>{
      console.log(data)
       this.rows=data;
       this.load=this.rows
    })
  }

  // Add holidays Modal Api Call
  

  addholidays() {
    if(this.addHolidayForm.invalid){
      this.markFormGroupTouched(this.addHolidayForm)
      return
    }
    if (this.addHolidayForm.valid) {
      let holiday = this.pipe.transform(
        this.addHolidayForm.value.Holidaydate,
        "dd-MM-yyyy"
      );
      let obj = {
        title: this.addHolidayForm.value.HolidayName,
        holidaydate: holiday,
        day: this.addHolidayForm.value.DaysName,
      };
      this.srvModuleService.add(obj,this.url).subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      });

      

      this.loadholidays();
      $("#add_holiday").modal("hide");
      this.addHolidayForm.reset();
      this.toastr.success("Holidays added", "Success");
    }
    
  }
 
  // 
  from(data) {
    this.editHolidayDate = this.pipe.transform(data, "dd-MM-yyyy");
  }

  savedata(){
      this.srvModuleService.addholiday(this.addHolidayForm.value).subscribe((res)=>{
        console.log(res)
    })
    this.srvModuleService.getall().subscribe(data=>{
      console.log(data)
       this.rows=data;
       this.load=this.rows
    })
    this.addHolidayForm.reset()
}
  // Edit holidays Modal Api Call

  editHolidays() {
    if (this.editHolidayForm.valid) {
      let obj = {
        title: this.editHolidayForm.value.editHolidayName,
        holidaydate: this.editHolidayDate,
        day: this.editHolidayForm.value.editDaysName,
        id: this.editId,
      };
      this.srvModuleService.update(obj, this.url).subscribe((data1) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      });
      this.loadholidays();
      $("#edit_holiday").modal("hide");
      this.toastr.success("Holidays Updated succesfully", "Success");
    }
  }

  editHolidays1(obj:any){
    this.srvModuleService.updateholiday(this.id,obj).subscribe((res: any) => {
      let id = res['id'];
      
      this.srvModuleService.getall().subscribe(data=>{
        console.log(data)
         this.rows=data;
         this.load=this.rows
      })
     
      this.editHolidayForm.reset();
    })
  }


  // Delete holidays Modal Api Call

  deleteHolidays() {
    this.srvModuleService.delete(this.tempId, this.url).subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.loadholidays();
      $("#delete_holiday").modal("hide");
      this.toastr.success("Holidays Deleted", "Success");
    });
  }

 deletedata(id:any){
  //  console.log(id)
   this.srvModuleService.deleteholiday(id).subscribe((res)=>{
    console.log(res)
   })
   this.srvModuleService.getall().subscribe(data=>{
    console.log(data)
     this.rows=data;
     this.load=this.rows
  })

 }
  // To Get The holidays Edit Id And Set Values To Edit Modal Form

  // edit(value) {
  //   this.editId = value;
  //   const index = this.lstHolidays.findIndex((item) => {
  //     return item.id === value;
  //   });
  //   let toSetValues = this.lstHolidays[index];
  //   this.editHolidayForm.setValue({
  //     editHolidayName: toSetValues.title,
  //     editHolidayDate: toSetValues.holidaydate,
  //     editDaysName: toSetValues.day,
  //   });
  // }

  edit1(id:any){
    this.srvModuleService.getoneholiday(id).subscribe((res: any) => {
      this.id=res.id;
      this.editHolidayForm.setValue({
        HolidayName: res.HolidayName,
        Holidaydate: res.Holidaydate,
        DaysName: res.DaysName,
       
      });
    });
  }
 
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
 

}
