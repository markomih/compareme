import { Component, OnInit } from '@angular/core';
import {ScoreService} from "../score.service";

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  constructor(public scoreService: ScoreService) { }

  ngOnInit() {
  }

}
