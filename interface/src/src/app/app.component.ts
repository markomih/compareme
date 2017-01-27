import {Component, EventEmitter} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import {register} from "ts-node/dist";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  modalActions = new EventEmitter<string|MaterializeAction>();
  register: boolean = true;

  openModal(type: string) {
    console.log(type);
    this.register = type === 'register';
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    console.log('closeModal');
    this.modalActions.emit({action:"modal",params:['close']});
  }

  checkCredentials(name, email, password){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailTest = re.test(email);
    if( name != "" && email != "" && password != "" && emailTest)
    {
      // TODO: call function
      this.closeModal();
    }
  }
  logout(){
    // TODO: send logout signal
  }
}
