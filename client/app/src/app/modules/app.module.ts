import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from '../components/app.component';
// import { GetCaptionsModule } from './get-captions/get-captions.module';
// import { GetSummaryModule } from './get-summary/get-summary.module';
// import { GetStatementsModule } from './get-statements/get-statements.module';
import { GetCaptionsModule } from './get-captions.module';
import { GetSummaryModule } from './get-summary.module';
import { GetStatementsModule } from './get-statements.module';


@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, GetCaptionsModule, GetSummaryModule, GetStatementsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
