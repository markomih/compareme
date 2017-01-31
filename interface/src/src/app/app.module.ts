import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {MaterializeDirective} from "angular2-materialize";

import {FileSelectDirective} from 'ng2-file-upload';

import {AppComponent} from './app.component';
import {InstructionComponent} from './instruction/instruction.component';
import {TableComponent} from './table/table.component';

import {InstructionService} from './shared/instruction.service';
import {TableService} from './shared/table.service';
import {UserService} from "./shared/user.service";
import { InstructionLogComponent } from './instruction-log/instruction-log.component';
import { DatabaseListComponent } from './database-list/database-list.component';
import { ScoreComponent } from './score/score.component';
import {ScoreService} from "./score.service";

@NgModule({
  declarations: [
    MaterializeDirective,
    AppComponent,
    InstructionComponent,
    FileSelectDirective,
    TableComponent,
    InstructionLogComponent,
    DatabaseListComponent,
    ScoreComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [
    TableService,
    InstructionService,
    UserService,
    ScoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

