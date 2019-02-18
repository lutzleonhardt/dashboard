import { NgModule } from '@angular/core'
import { TileComponent } from 'src/components/tile/tile.component'
import { MatCardModule } from '@angular/material'

@NgModule({
  imports: [ MatCardModule ],
  declarations: [ TileComponent ],
  exports: [ TileComponent ],
})
export class TileModule {
}
