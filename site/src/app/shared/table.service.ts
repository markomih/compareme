import { Injectable } from '@angular/core';

import { Table } from './table';

@Injectable()
export class TableService {
  public table: Table
  
  constructor() { 
    this.table = new Table();
  }

  save(table: Table): void {
    this.table = table;
    this.table.print();
  }

}
