import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { InstructionService } from './services/instruction.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent  { 
  name = 'Angular'; 

  constructor(private instructionService: InstructionService){
  }
  public uploader:FileUploader = new FileUploader({
    url:'http://localhost:5000/upload'
  });
  
  instruction(event:KeyboardEvent, command:string):void {
    let code = event.code.toLowerCase();
    if (code === "enter") {
      if (command == "load data") {
        console.log("LOAD DATA");
      }
    } else if (code == "space") {
      console.log("SPACE");
    }
  }

  uploadFile(event: Event): void{
    if (event.currentTarget.files) {
      var file = event.currentTarget.files[0];

      var reader  = new FileReader();

      var is = this;
      reader.addEventListener("load", function () {
        // console.log(reader.result);
        is.instructionService.save(reader.result);
      }, false);

      if (file) reader.readAsDataURL(file);

    }
  }
  
}
