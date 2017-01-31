import { Component, OnInit, Input } from '@angular/core';
import { TableService } from '../shared/table.service';
import { Table } from '../shared/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(public tableService: TableService) { }

  ngOnInit() {
  }

}
