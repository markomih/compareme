import { Component, OnInit } from '@angular/core';

@Component({
    // moduleId: module.id,
  selector: 'app-material',
  template: './material.component.html',
//   styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {

  isDarkTheme: boolean = false;

  foods: any[] = [
    {name: 'Pizza', rating: 'Excellent'},
    {name: 'Burritos', rating: 'Great'},
    {name: 'French fries', rating: 'Pretty good'},
  ];

  progress: number = 0;

  constructor() {
  }

  ngOnInit() {
  }

}
