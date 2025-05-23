import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetStatementsComponent } from '../components/get-statements.component';
import { CardModule } from './card.module';

@NgModule({
    declarations: [GetStatementsComponent],
    imports: [CommonModule, CardModule],
    exports: [GetStatementsComponent],
})
export class GetStatementsModule {}
