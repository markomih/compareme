import { Component, OnInit, Renderer } from '@angular/core';
import { InstructionService } from '../shared/instruction.service';
import { FileUploader, FileItem } from 'ng2-file-upload';

import { Table } from '../shared/table';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css'],
})
export class InstructionComponent implements OnInit {

  name = 'Angular'; 
  table: Table;

  public uploader:FileUploader;
  constructor(private instructionService: InstructionService){}

  ngOnInit() {
    this.table = new Table();
    this.uploader = new FileUploader({url:'http://localhost:5000/upload'});
  }

  
  instruction(event:KeyboardEvent, command:string):void {
    let code = event.code.toLowerCase();
    if (code === "enter") {
      if (command == "load data") {
        console.log("LOAD DATA");
        document.getElementById("file-load-data").click();
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
      var self = this;
      this.uploader.onCompleteItem = (item: FileItem, response:string, status:number, headers:any) => {
            let data = JSON.parse(response);
           
            if (status == 200 && data.success) {
              
              let dataObject = JSON.parse(data.data);
              for (var columnLabel in dataObject) {
                var column = dataObject[columnLabel];
                var columnValues: string[] = [];

                for (var keyI in column){
                  columnValues.push(column[keyI].toString());
                }
                self.table.addTableColumn(columnLabel, columnValues);
              }
              self.table.print();
            } else {
              console.error("MRRRRRK");
            }
        };
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
