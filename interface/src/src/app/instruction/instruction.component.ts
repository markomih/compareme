import {Component, OnInit} from '@angular/core';
import {FileUploader, FileItem} from 'ng2-file-upload';

import {InstructionService} from '../shared/instruction.service';
import {TableService} from '../shared/table.service';

import {ScoreService} from "../score.service";
import {Score} from "../shared/score";
import {UserService} from "../shared/user.service";

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css'],
})
export class InstructionComponent implements OnInit {
  public uploader: FileUploader;
  private command: string = "";
  private lastClassifier = "";

  constructor(private instructionService: InstructionService,
              private tableService: TableService,
              private scoreService: ScoreService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: this.tableService.url_upload,
      authToken: this.userService.user.token
    });
  }

  arrowUp() {
    this.instructionService.setPrevInstruction();
  }

  arrowDown() {
    this.instructionService.setNextInstruction();
  }

  restoreInstruction() {
    this.command = this.instructionService.getCurrentInstruction();
  }

  instruction(): void {
    let isValid: boolean = false;

    let functionName: string = this.command.slice(0, this.command.indexOf(" "));

    if (this.command === "load") {
      document.getElementById("file-load-data").click();
      isValid = true;
    } else {
      let parameterList = this.command.slice(this.command.indexOf(" ") + 1);
      // let parameterArray = InstructionService.parseParameters(parameterList);
      let parameterArray = parameterList.split(' ');
      if (functionName == "select" && isNumeric(parameterArray[0])) {
        if (isNumeric(parameterArray[0])) {
          let index: number = parseInt(parameterArray[0]);
          if (index > this.userService.user.tables.length) {
            alert("index out of range");
          } else {
            this.tableService.selectTable(this.userService.user.tables[index - 1].id)
              .then(res => {
              });
            isValid = true;
          }
        } else {
          alert("Parameter must be a number")
        }
      } else if (functionName === "remove") {
        this.tableService.removeLabels(parameterArray);
        isValid = true;
      } else if (functionName === "set") {
        this.tableService.setLabels(parameterArray);
        isValid = true;
      } else if (functionName === "class") {
        this.tableService.setClass(parameterArray[0]);
        isValid = true;
      } else if (functionName === "apply") {
        console.log(this.tableService.table.classLabel);
        if (this.tableService.isValidClassifier(parameterArray[0]) && this.tableService.table.classLabel !== null) {
          isValid = true;
          this.lastClassifier = parameterArray[0];
          this.tableService.apply(parameterArray[0]).then((res) => {
            this.tableService.deleteRemovedLabels();
            this.scoreService.setScore(new Score(res, parameterArray[0], this.tableService.table.id));
          });
        } else {
          alert("Class name must be set!");
        }
      } else if (functionName === "predict") {
        isValid = true;
        let j = 0;
        let ret_json = [];
        for (let i in this.tableService.table.columns) {
          if (this.tableService.table.classLabel != this.tableService.table.columns[i].label) {
            ret_json.push({'label': this.tableService.table.columns[i].label, 'value': parseInt(parameterArray[j++])})
          }
        }
        this.tableService.predict(ret_json, this.lastClassifier).then(res => {
          this.scoreService.setScore(new Score(res, "prediction", this.tableService.table.id));
          // alert('Prediction is: ' + res);
        });
      }
    }
    if (isValid) {
      this.instructionService.addInstruction(this.command);
      this.command = "";
    }
  }

  uploadFile(event: Event): void {
    this.uploader.uploadAll();
    this.uploader.onCompleteItem =
      (item: FileItem, response: string, status: number, headers: any) => {
        if (response === "") {
          alert("Data is not loaded properly, check your server");
        } else {
          let dataObject = JSON.parse(response);
          if (dataObject.success) {
            this.tableService.saveTable(dataObject);
            this.userService.updateUserView();
          } else if (dataObject.data == 401) {
            this.userService.removeUserDataLocally();
          }
        }
      };
  }
}
function isNumeric(value) {
  return /^\d+$/.test(value);
}
