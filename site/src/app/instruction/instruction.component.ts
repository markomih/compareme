import { Component, OnInit } from '@angular/core';
import { InstructionService } from '../shared/instruction.service';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css'],
})
export class InstructionComponent implements OnInit {

  name = 'Angular'; 
  public uploader:FileUploader;

  constructor(private instructionService: InstructionService){}

  ngOnInit() {
    this.uploader = new FileUploader({url:'http://localhost:5000/upload'});
  }

  
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
    let u = true;
    if (u)
    {
      console.log(this.uploader);
      // this.uploader.queue.forEach(item => {
      //   item.upload();
      // });
      this.uploader.uploadAll();
    } else{
      console.log(event.currentTarget);
      this.instructionService.save("MRRRRRK").then(r => console.log(r));
      // if (event.currentTarget.files) {
      //   var file = event.currentTarget.files[0];

      //   var reader  = new FileReader();

      //   var is = this;
      //   reader.addEventListener("load", function () {
      //     // console.log(reader.result);
      //     is.instructionService.save(reader.result);
      //   }, false);

      //   if (file) reader.readAsDataURL(file);

      }
  }
}
