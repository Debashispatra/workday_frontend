import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AllModulesService } from "src/app/all-modules/all-modules.service";
import { WebStorage } from "src/app/core/storage/web.storage";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public CustomControler;
  public subscription: Subscription;
  public Toggledata=true;
  form = new FormGroup({
    email: new FormControl("admin@dreamguys.in", [Validators.required]),
    password: new FormControl('123456', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(private storage: WebStorage,
    private allService : AllModulesService
    ) {
    this.subscription = this.storage.Loginvalue.subscribe((data) => { 
      if(data != 0){
        this.CustomControler = data;
      }
    });
  }

  ngOnInit() {
    this.storage.Checkuser();
  }

  submit() {
    this.storage.Login(this.form.value);
  }

  LoginUser(){
    console.log(this.form.value);
    var enteredValue = this.form.value;
    var loginObj = {
      "email" : enteredValue.email,
      "password" : enteredValue.password
    }
    this.allService.login(loginObj).subscribe((response) => {
      console.log(`response received`,response);
      
    },(error)=>{
      console.log(`error has occured`,error);
      
    })
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  iconLogle(){
    this.Toggledata = !this.Toggledata
  }
}
