import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { IUser } from '../../models/iuser';
import { AccountService } from '../../services/account.service';
import { threadId } from 'worker_threads';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from "../../forms/text-input/text-input.component";
import { DateInputComponent } from "../../forms/date-input/date-input.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, TextInputComponent, DateInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  @Output() CancelRegister = new EventEmitter<boolean>();
  registerForm:FormGroup = new FormGroup({});
  maxDate:Date = new Date();
  validationErrors:any = [];

  constructor(private accountService:AccountService, private toastr:ToastrService,
    private fb:FormBuilder, private router:Router){}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  register(){
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigateByUrl('/members'),
      error: (err:any) => this.validationErrors = err
    })
  }
  cancel(){
    this.CancelRegister.emit(false);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, this.matchValue('password')]]
    });
  }

  matchValue(matchTo:string) : ValidatorFn{
    return (control:AbstractControl) =>{
      return control.value === control.parent?.get(matchTo)?.value? null : {isMatching: true}
    }
  }
  changePasswordValue(){
    this.registerForm.controls['password'].valueChanges.subscribe(() =>{
      this.registerForm.controls['confirmPassword'].updateValueAndValidity
    });
  }
  get username(){
    return this.registerForm.get('username') as FormControl;
  }
  get password(){
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPassword(){
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  get gender(){
    return this.registerForm.get('gender') as FormControl;
  }

  get knownAs(){
    return this.registerForm.get('knownAs') as FormControl;
  }

  get dateOfBirth(){
    return this.registerForm.get('dateOfBirth') as FormControl;
  }

  get city(){
    return this.registerForm.get('city') as FormControl;
  }

  get country(){
    return this.registerForm.get('country') as FormControl;
  }
}
