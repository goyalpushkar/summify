import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetCaptionsComponent } from '../components/get-captions.component';
import { CardModule } from './card.module';

@NgModule({
    declarations: [GetCaptionsComponent],
    imports: [CommonModule, CardModule],
    exports: [GetCaptionsComponent],
})
export class GetCaptionsModule {}
