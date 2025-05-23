import { Component } from '@angular/core';
import {GetCaptionsComponent} from './get-captions.component'
import {GetStatementsComponent} from './get-statements.component'
import {GetSummaryComponent} from './get-summary.component'

@Component({
  selector: 'app-root',
  imports: [GetCaptionsComponent, GetStatementsComponent, GetSummaryComponent],
  templateUrl: '../app.component.html',
  styleUrl: '../css/app.component.css'
})
export class AppComponent {
  title = 'app';
}
