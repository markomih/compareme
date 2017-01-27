/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TableService } from './table.service';

describe('TableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableService]
    });
  });

  it('should ...', inject([TableService], (service: TableService) => {
    expect(service).toBeTruthy();
  }));
});
