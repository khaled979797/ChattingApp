import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../models/iuser';
import { AccountService } from '../../services/account.service';
import { threadId } from 'worker_threads';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  model:any = {};
  @Output() CancelRegister = new EventEmitter<boolean>();
  registerForm:FormGroup = new FormGroup({});

  constructor(private accountService:AccountService, private toastr:ToastrService){}

  ngOnInit(): void {
    this.initializeForm();
  }

  register(){
    this.accountService.register(this.model).subscribe({
      next: () => this.cancel()
    })
  }
  cancel(){
    this.CancelRegister.emit(false);
  }

  initializeForm(){
    this.registerForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl()
    });
  }
}
