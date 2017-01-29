import {Component, OnInit} from '@angular/core';
import {FileUploader, FileItem} from 'ng2-file-upload';

import {InstructionService} from '../shared/instruction.service';
import {TableService} from '../shared/table.service';

import {Table} from '../shared/table';
import {ScoreService} from "../score.service";
import {Score} from "../shared/score";

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css'],
})
export class InstructionComponent implements OnInit {
  public uploader: FileUploader;
  private command: string="";

  constructor(private instructionService: InstructionService,
              private tableService: TableService,
              private scoreService: ScoreService) {
  }

  ngOnInit() {
    this.uploader = new FileUploader({url: this.instructionService.instructionUrl});
  }

  arrowUp() {
    this.instructionService.setPrevInstruction();
  }

  arrowDown() {
    this.instructionService.setNextInstruction();
  }
  restoreInstruction(){
    this.command = this.instructionService.getCurrentInstruction();
  }
  instruction(): void {
    let isValid: boolean = false;

    let functionName: string = this.command.slice(0, this.command.indexOf(" "));
    if (this.command === "load") {
      console.log("LOAD " + this.command);
      isValid = true;
      document.getElementById("file-load-data").click();
    } else if (this.command === "plot") {
      console.log("PLOT " + this.command);
    }
    else {
      let parameters: string[] = InstructionService.parseParameters(this.command.slice(this.command.indexOf(" ") + 1));

      if (functionName === "remove") {
        this.tableService.removeLabels(parameters);
        isValid = true;
      } else if (functionName === "set") {
        this.tableService.setLabels(parameters);
        isValid = true;
      } else if (functionName === "class") {
        this.tableService.setClass(parameters[0]);
        isValid = true;
      } else if (functionName === "apply") {
        if (this.tableService.isValidClassifier(parameters[0])) {
          isValid = true;
          this.tableService.apply(parameters[0]).then((res) => {
            this.scoreService.setScore(new Score(res, parameters[0], this.tableService.table.id))
          });
        } else {
          console.log("APPLY incorrect!");
        }
      } else if (functionName === "predict") {
        isValid = true;
        console.log("predict " + parameters);
      }
    }
    if (isValid){
      this.instructionService.addInstruction(this.command);
      this.command = "";
    }
  }

  uploadFile(event: Event): void {
    this.uploader.uploadAll();
    this.uploader.onCompleteItem =
      (item: FileItem, response: string, status: number, headers: any) => {
        if (response === "") {
          alert("Data is not loaded propperly, check your server");
        }
        else {
          let data = JSON.parse(response);

          if (!(status == 200 && data.success)) {
            console.error("MRRRRRK");
          } else {
            let dataColumns = JSON.parse(data.data.columns);
            let dataId: number = JSON.parse(data.data.table_id);

            let table: Table = new Table(dataId);

            for (let columnLabel in dataColumns) {
              let column = dataColumns[columnLabel];
              let columnValues: string[] = [];

              for (let keyI in column) {
                columnValues.push(column[keyI].toString());
              }
              table.addTableColumn(columnLabel, columnValues);
            }
            this.tableService.save(table);
          }
        }
      };
  }
}
