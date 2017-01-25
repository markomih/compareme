import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule } from '@angular/material';

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { InstructionComponent } from './instruction/instruction.component';
import { TableComponent } from './table/table.component';

import { InstructionService } from './shared/instruction.service';
import { TableService } from './shared/table.service';

@NgModule({
  declarations: [
    AppComponent,
    InstructionComponent,
    FileSelectDirective,
    TableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [
    TableService,
    InstructionService,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
