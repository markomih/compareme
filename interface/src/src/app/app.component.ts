import {Component, EventEmitter, OnInit} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import {UserService} from "./shared/user.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string;
  modalActions: EventEmitter<string|MaterializeAction>;
  register: boolean;
  message: string = "";

  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
    this.title = 'app works!';
    this.modalActions = new EventEmitter<string|MaterializeAction>();
    this.message = "";
    if (this.userService.user.token){
      this.userService.isLogged().then(res =>
      {
        this.register = res
      });
    } else {
      this.register = false;
    }
  }

  openModal() {
    this.modalActions.emit({action: "modal", params: ['open']});
  }
  closeModal() {
    console.log('closeModal');
    this.modalActions.emit({action: "modal", params: ['close']});
  }
  checkCredentials() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailTest = re.test(this.userService.user.email);
    if (this.register && this.userService.user.name != "" && this.userService.user.email != "" && this.userService.user.password != "" && emailTest) {
      this.userService.register(this.userService.user).then(res=>this.printMessage(res));
    } else if (this.userService.user.email != "" && this.userService.user.password != "" && emailTest){
      this.userService.login(this.userService.user).then(res=>this.printMessage(res));
    }
  }

  printMessage(status){
    if(status){
      this.closeModal();
      this.message = "";
      this.userService.updateUserView();
    } else {
      this.message = "Invalid credentials";
    }
  }

  logout() {
    this.userService.logout();
  }
}

