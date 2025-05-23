import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetSummaryComponent } from '../components/get-summary.component';
import { CardModule } from './card.module';

@NgModule({
    declarations: [GetSummaryComponent],
    imports: [CommonModule, CardModule],
    exports: [GetSummaryComponent],
})
export class GetSummaryModule {}
