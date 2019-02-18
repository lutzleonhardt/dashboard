import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HistoricalTabComponent } from 'src/tabs/historical-tab/historical-tab.component'
import { StateModule } from 'src/services/state.module'
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule,
  MatTableModule,
} from '@angular/material'
import { ReactiveFormsModule } from '@angular/forms'
import { AmazingTimePickerModule } from 'amazing-time-picker-angular6'
import { ChartsModule } from 'ng2-charts'

@NgModule({
  imports: [
    CommonModule,
    StateModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    AmazingTimePickerModule,
    MatGridListModule,
    MatTableModule,
    ChartsModule,
  ],
  declarations: [ HistoricalTabComponent ],
  exports: [ HistoricalTabComponent ],
})
export class HistoricalTabModule {
}
