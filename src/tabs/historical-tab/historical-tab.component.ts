import { Component, OnDestroy, OnInit } from '@angular/core'
import { StateService } from 'src/services/state.service'
import { FormControl } from '@angular/forms'
import { distinct, tap } from 'rxjs/operators'
import { Subscription } from 'rxjs'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'

@AutoUnsubscribe()
@Component({
  selector: 'vw-historical-tab',
  templateUrl: './historical-tab.component.html',
  styleUrls: [ './historical-tab.component.scss' ],
})

export class HistoricalTabComponent implements OnInit, OnDestroy {
  public machineFormControl = new FormControl(null)

  private currentMachineFromStateSubscription = Subscription.EMPTY

  private currentMachineToStateSubscription = Subscription.EMPTY

  public startDateFormControl = new FormControl(null)

  private startDateToStateSubscription = Subscription.EMPTY

  private startDateFromStateSubscription = Subscription.EMPTY

  public startTimeFormControl = new FormControl(null)

  private startTimeToStateSubscription = Subscription.EMPTY

  private startTimeFromStateSubscription = Subscription.EMPTY

  public endTimeFormControl = new FormControl(null)

  private endTimeToStateSubscription = Subscription.EMPTY

  private endTimeFromStateSubscription = Subscription.EMPTY

  public constructor(public stateService: StateService) { }

  public ngOnInit() {
    this.currentMachineFromStateSubscription = this.stateService.currentHistoryMachine$.pipe
                                                   (
                                                     distinct(),
                                                     tap(currentLiveMachine => this.machineFormControl.setValue(currentLiveMachine)),
                                                   )
                                                   .subscribe()

    this.currentMachineToStateSubscription = this.machineFormControl.valueChanges.pipe
                                                 (
                                                   tap(machine => this.stateService.currentHistoryMachine$.next(machine)),
                                                 )
                                                 .subscribe()

    this.startDateToStateSubscription = this.startDateFormControl.valueChanges.pipe
                                            (
                                              tap(date => this.stateService.historyStartDate$.next(date)),
                                            )
                                            .subscribe()

    this.startDateFromStateSubscription = this.stateService.historyStartDate$.pipe
                                              (
                                                distinct(),
                                                tap(date => this.startDateFormControl.setValue(date)),
                                              )
                                              .subscribe()

    this.endTimeToStateSubscription = this.endTimeFormControl.valueChanges.pipe
                                          (
                                            tap(time => this.stateService.historyEndTime$.next(time)),
                                          )
                                          .subscribe()

    this.endTimeFromStateSubscription = this.stateService.historyEndTime$.pipe
                                            (
                                              distinct(),
                                              tap(time => this.endTimeFormControl.setValue(time)),
                                            )
                                            .subscribe()

    this.startTimeToStateSubscription = this.startTimeFormControl.valueChanges.pipe
                                            (
                                              tap(time => this.stateService.historyStartTime$.next(time)),
                                            )
                                            .subscribe()

    this.startTimeFromStateSubscription = this.stateService.historyStartTime$.pipe
                                              (
                                                distinct(),
                                                tap(time => this.startTimeFormControl.setValue(time)),
                                              )
                                              .subscribe()

  }

  public ngOnDestroy(): void {
  }
}
