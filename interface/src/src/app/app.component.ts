import {Component, EventEmitter, OnInit} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import {register} from "ts-node/dist";
import {UserService} from "./shared/user.service";
import {User} from "./shared/user";
import {stat} from "fs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string;
  modalActions: EventEmitter<string|MaterializeAction>;
  register: boolean;
  user: User;
  isValidUser: boolean;
  message: string = "";

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.title = 'app works!';
    this.register = true;
    this.modalActions = new EventEmitter<string|MaterializeAction>();
    this.user = new User("","","");
    this.isValidUser = false;
    this.message = "";
  }

  openModal(type: string) {
    console.log(type);
    this.register = type === 'register';
    this.modalActions.emit({action: "modal", params: ['open']});
  }
  closeModal() {
    console.log('closeModal');
    this.modalActions.emit({action: "modal", params: ['close']});
  }
  checkCredentials() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailTest = re.test(this.user.email);
    if (register && this.user.name != "" && this.user.email != "" && this.user.password != "" && emailTest) {
      this.userService.register(this.user).then((status:[boolean, string]) =>{
        this.changeSession(status[0], status[1]);
      });
    } else if (this.user.email != "" && this.user.password != "" && emailTest){
      this.userService.login(this.user).then((status:[boolean, string])=>{
        this.changeSession(status[0], 'Wrong credentials!');
      });
    }
  }
  changeSession(status, message){
    if(status){
      this.closeModal();
      this.message = "";
    } else {
      this.message = message;
    }
    this.isValidUser = status;
  }
  logout() {
    this.userService.logout().then((status: boolean)=>{
      this.isValidUser = !status;
    })
  }
}

