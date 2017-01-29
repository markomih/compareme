import { Injectable } from '@angular/core';
import {Score} from "./shared/score";

@Injectable()
export class ScoreService {
  public score: Score;

  constructor() {
  }

  setScore(score: Score){
    this.score = score;
  }
}
