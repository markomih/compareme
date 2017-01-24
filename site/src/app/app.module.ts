import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { InstructionComponent } from './instruction/instruction.component';
import { InstructionService } from './shared/instruction.service';

@NgModule({
  declarations: [
    AppComponent,
    InstructionComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  providers: [InstructionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
