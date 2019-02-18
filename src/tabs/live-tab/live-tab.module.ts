import { NgModule } from '@angular/core'
import { LiveTabComponent } from 'src/tabs/live-tab/live-tab.component'
import { MatBadgeModule, MatCardModule, MatFormFieldModule, MatGridListModule, MatSelectModule, MatSliderModule } from '@angular/material'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { TileModule } from 'src/components/tile/tile.module'
import { ChartsModule } from 'ng2-charts'

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatGridListModule,
    TileModule,
    MatSliderModule,
    MatBadgeModule,
    MatCardModule,
    ChartsModule,
  ],
  declarations: [ LiveTabComponent ],
  exports: [ LiveTabComponent ],
})
export class LiveTabModule {
}
