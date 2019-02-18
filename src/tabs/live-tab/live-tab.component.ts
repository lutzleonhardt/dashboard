import { Component, OnDestroy, OnInit } from '@angular/core'
import { StateService } from 'src/services/state.service'
import { FormControl } from '@angular/forms'
import { EMPTY, Observable, Subscription } from 'rxjs'
import { distinct, map, tap } from 'rxjs/operators'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'

@AutoUnsubscribe()
@Component({
  selector: 'vw-live-tab',
  templateUrl: './live-tab.component.html',
  styleUrls: [ './live-tab.component.scss' ],
})

export class LiveTabComponent implements OnInit, OnDestroy {

  public machineFormControl = new FormControl(null)

  private currentMachineToStateSubscription = Subscription.EMPTY

  private currentMachineFromStateSubscription = Subscription.EMPTY

  private refreshRateToStateSubscription = Subscription.EMPTY

  private refreshRateFromStateSubscription = Subscription.EMPTY

  public refreshRateFormControl = new FormControl(null)

  public livePower5Min$: Observable<[ { data: number[], label: string } ]> = EMPTY

  public labels = Array.from({ length: 100 }, (v, i) => ' ')

  public colors = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: '#ff4081',
      pointBackgroundColor: '#ff4081',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ]

  public constructor(public stateService: StateService) { }

  public ngOnInit() {
    setTimeout(() => this.stateService.enableLiveUpdate$.next(true), 0)

    this.currentMachineFromStateSubscription = this.stateService.currentLiveMachine$.pipe
                                                   (
                                                     distinct(),
                                                     tap(currentLiveMachine => this.machineFormControl.setValue(currentLiveMachine)),
                                                   )
                                                   .subscribe()

    this.currentMachineToStateSubscription = this.machineFormControl.valueChanges.pipe
                                                 (
                                                   tap(machine => this.stateService.currentLiveMachine$.next(machine)),
                                                 )
                                                 .subscribe()

    this.refreshRateFromStateSubscription = this.stateService.liveRefreshRate$.pipe
                                                (
                                                  distinct(),
                                                  tap(rate => this.refreshRateFormControl.setValue(rate / 1000)),
                                                )
                                                .subscribe()
    this.refreshRateToStateSubscription = this.refreshRateFormControl.valueChanges.pipe
                                              (
                                                tap(rate => this.stateService.liveRefreshRate$.next(rate * 1000)),
                                              )
                                              .subscribe()

    this.livePower5Min$ = this.stateService.livePower5Min$.pipe
    (
      map(livePower5Min => ([
          {
            data: livePower5Min || [],
            label: 'Power in W',
          },
        ] as [ { label: string, data: number[] } ]),
      ))
  }

  public ngOnDestroy(): void {
    this.stateService.enableLiveUpdate$.next(false)
  }

  public refreshRateDisplayWith(refreshRate: number) {
    return `${refreshRate}s`
  }

}
