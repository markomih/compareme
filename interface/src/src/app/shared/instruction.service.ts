import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {InstructionHistory} from "./instruction-history";

@Injectable()
export class InstructionService {
  public instructionUrl = 'http://localhost:5000/upload';
  public instructionHistory: InstructionHistory;

  constructor(private http: Http) {
    this.instructionHistory = new InstructionHistory();
  }

  static parseParameters(parameterList: string): string[] {
    parameterList = parameterList.trim();
    let pars: string[] = parameterList.split(" ");
    var parameters: string[] = [];

    let inside = false;
    let pom: string = "";
    for (let i = 0; i < pars.length; i++) {
      if (pars[i].indexOf('\'') > -1) {
        if (!inside) {
          pom = pars[i].replace('\'', '') + ' ';
        }
        else {
          pom = pom.concat(pars[i].replace('\'', ''));
          parameters.push(pom.trim());
        }
        inside = !inside;
      } else if (inside) {
        pom = pom.concat(pars[i].replace('\'', '')) + ' ';
      } else {
        parameters.push(pars[i].trim());
      }
    }
    return parameters;
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  isEmptyHistory():boolean {
    return this.instructionHistory.instructionList.length > 0;
  }
  getHistory(): string[]{
    return this.instructionHistory.instructionList;
  }
  isPointer(i:number):boolean{
    return this.instructionHistory.pointer === i;
  }
  getCurrentInstruction(): string {
    return this.instructionHistory.instructionList[this.instructionHistory.pointer];
  }

  addInstruction(instruction: string) {
    if (this.instructionHistory.pointer === -1) this.instructionHistory.pointer = 0;

    this.instructionHistory.instructionList.push(instruction);
  }

  setNextInstruction() {
    if (this.instructionHistory.pointer < this.instructionHistory.instructionList.length - 1) {
      this.instructionHistory.pointer += 1;
    }
  }

  setPrevInstruction() {
    if (this.instructionHistory.pointer > 0) {
      this.instructionHistory.pointer -= 1;
    }
  }
}
