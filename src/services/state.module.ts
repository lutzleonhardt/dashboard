import { NgModule } from '@angular/core'
import { StateService } from 'src/services/state.service'
import { InfluxModule } from 'src/services/influx.module'

@NgModule({
  imports: [ InfluxModule ],
  providers: [ StateService ],
})
export class StateModule {
}
