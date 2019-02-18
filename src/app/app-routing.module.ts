import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LiveTabComponent } from 'src/tabs/live-tab/live-tab.component'
import { HistoricalTabComponent } from 'src/tabs/historical-tab/historical-tab.component'

const routes: Routes = [
  {
    path: 'live',
    component: LiveTabComponent,
  }, {
    path: 'historical',
    component: HistoricalTabComponent,
  },
  {
    path: '',
    redirectTo: 'live',
    pathMatch: 'full',
  },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}
