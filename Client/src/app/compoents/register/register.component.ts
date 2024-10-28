import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../models/iuser';
import { AccountService } from '../../services/account.service';
import { threadId } from 'worker_threads';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  model:any = {};
  @Output() CancelRegister = new EventEmitter<boolean>();

  constructor(private accountService:AccountService, private toastr:ToastrService){}

  register(){
    this.accountService.register(this.model).subscribe({
      next: () => this.cancel(),
      error: (err) => this.toastr.error(err.error)
    })
  }
  cancel(){
    this.CancelRegister.emit(false);
  }
}
