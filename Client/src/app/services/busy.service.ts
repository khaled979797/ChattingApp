import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private spinner:NgxSpinnerService) { }

  busy(){
    this.busyRequestCount++;
    this.spinner.show(undefined, {
      type: "ball-scale-multiple",
      bdColor: "rgba(51,51,51,0.1)",
      color: "#333333"
    })
  }

  idle(){
    this.busyRequestCount--;
    if(this.busyRequestCount <= 0){
      this.busyRequestCount = 0;
      this.spinner.hide();
    }
  }
}
