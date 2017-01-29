import { Component, OnInit } from '@angular/core';
import {InstructionService} from "../shared/instruction.service";

@Component({
  selector: 'app-instruction-log',
  templateUrl: './instruction-log.component.html',
  styleUrls: ['./instruction-log.component.css']
})
export class InstructionLogComponent implements OnInit {

  constructor(public instructionService:InstructionService) { }

  ngOnInit() {
  }

}
