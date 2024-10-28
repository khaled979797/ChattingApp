import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {
  validationErrors: string[] = [];

  constructor(private http:HttpClient){}

  get404Error(){
    this.http.get(environment.apiUrl + 'Buggy/NotFound').subscribe(response =>{
      next: () => console.log(response);
      error: (err:Error) => console.log(err.message);
    })
  }

  get400Error(){
    this.http.get(environment.apiUrl + 'Buggy/BadRequest').subscribe(response =>{
      next: () => console.log(response);
      error: (err:Error) => console.log(err.message);
    })
  }

  get500Error(){
    this.http.get(environment.apiUrl + 'Buggy/ServerError').subscribe(response =>{
      next: () => console.log(response);
      error: (err:Error) => console.log(err.message);
    })
  }

  get401Error(){
    this.http.get(environment.apiUrl + 'Buggy/Auth').subscribe(response =>{
      next: () => console.log(response);
      error: (err:Error) => console.log(err.message);
    })
  }

  get400ValidationError(){
    this.http.post(environment.apiUrl + 'Account/Register', {}).subscribe({
      next: () => console.log('success'),
      error: (err:any) => {
        console.log(err);
        this.validationErrors = err;
      }
    })
  }
}
