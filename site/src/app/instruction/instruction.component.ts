import { Component, OnInit, Renderer } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';

import { InstructionService } from '../shared/instruction.service';
import { TableService } from '../shared/table.service';

import { Table } from '../shared/table';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css'],
})
export class InstructionComponent implements OnInit {

  name = 'Angular'; 

  public uploader:FileUploader;
  constructor(
    private instructionService: InstructionService, 
    private tableService: TableService){}

  ngOnInit() {
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
    this.uploader.uploadAll();
    this.uploader.onCompleteItem = 
      (item: FileItem, response:string, status:number, headers:any) => {
          let data = JSON.parse(response);
          
          if (status == 200 && data.success) {
            
            let dataObject = JSON.parse(data.data);
            let table: Table = new Table();
            for (var columnLabel in dataObject) {
              let column = dataObject[columnLabel];
              let columnValues: string[] = [];

              for (var keyI in column) {
                columnValues.push(column[keyI].toString());
              }
              table.addTableColumn(columnLabel, columnValues);
            }
            this.tableService.save(table);
          } else {
            console.error("MRRRRRK");
          }
      };
  }
}
