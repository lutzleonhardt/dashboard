import { Component } from '@angular/core'
import { StateService } from 'src/services/state.service'
import 'hammerjs'

@Component({
  selector: 'vw-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent {
  public constructor(public stateService: StateService) {
  }
}
