import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';


import { AppComponent }  from './app.component';
import { InstructionService } from './services/instruction.service';

@NgModule({
  imports:      [ BrowserModule, HttpModule ],
  declarations: [ AppComponent, FileSelectDirective ],
  bootstrap:    [ AppComponent ],
  providers: [InstructionService]
})
export class AppModule { }
