import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatProgressSpinnerModule, MatTabsModule, MatToolbarModule } from '@angular/material'
import { AppRoutingModule } from 'src/app/app-routing.module'
import { HistoricalTabModule } from 'src/tabs/historical-tab/historical-tab.module'
import { LiveTabModule } from 'src/tabs/live-tab/live-tab.module'
import { StateModule } from 'src/services/state.module'
import { CommonModule } from '@angular/common'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTabsModule,
    AppRoutingModule,
    HistoricalTabModule,
    LiveTabModule,
    StateModule,
    MatProgressSpinnerModule,
    StateModule,
  ],
  providers: [],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
