import { Injectable } from '@angular/core'
import { BehaviorSubject, combineLatest, EMPTY, interval, merge, Observable, of } from 'rxjs'
import { InfluxService } from 'src/services/influx.service'
import { filter, map, share, startWith, switchMap, tap } from 'rxjs/operators'
import { groupBy, reduce } from 'lodash'

@Injectable()
export class StateService {
  public constructor(private influxService: InfluxService) {
    this.loadMachines()
    this.initLiveUpdate()
    this.initLoadingState()
    this.initHistoryView()
  }

  // Live

  public currentLiveMachine$ = new BehaviorSubject<string | null>(null)

  public machines$: Observable<string[]> = EMPTY

  public liveRefreshRate$ = new BehaviorSubject<number>(1000)

  public currentLiveState$: Observable<string | null> = EMPTY

  public currentLivePower$: Observable<string | null> = EMPTY

  public livePower5Min$: Observable<number[]> = EMPTY

  public periodCounter$: Observable<string> = EMPTY

  public enableLiveUpdate$ = new BehaviorSubject<boolean>(false)

  // History
  public currentHistoryMachine$ = new BehaviorSubject<string | null>(null)

  public historyStartDate$ = new BehaviorSubject<Date | null>(null)

  public historyStartTime$ = new BehaviorSubject<string | null>(null)

  public historyEndTime$ = new BehaviorSubject<string | null>(null)

  public historyTableData$: Observable<{ state: string, power: number }[]> = EMPTY

  public isHistoryTableDataVisible$: Observable<boolean> = EMPTY

  public historyPieData$: Observable<number[]> = EMPTY

  public historyPieLabels$: Observable<string[]> = EMPTY

  public isLoading$: Observable<boolean> = EMPTY

  private initLoadingState() {
    this.isLoading$ = combineLatest(
      this.enableLiveUpdate$,
      this.currentLiveMachine$,
      this.currentLiveState$,
      this.currentLivePower$)
      .pipe
      (
        map(([
               enableLiveUpdate,
               currentLiveMachine,
               currentLiveState,
               currentLivePower,
             ]) => enableLiveUpdate && currentLiveMachine && (!currentLiveState || !currentLivePower)),
      )
  }

  private loadMachines() {
    this.machines$ = this.influxService.getAllMachines()
  }

  private initLiveUpdate() {

    const livePeriodRefreshRateAndMachine$ = combineLatest(
      this.liveRefreshRate$,
      this.currentLiveMachine$,
      this.enableLiveUpdate$,
    )
      .pipe
      (
        switchMap(([ refreshRate, machine, enableLiveUpdate ]) => merge(
          of([ null, null, null ]),
          enableLiveUpdate ?
          interval(1000)
            .pipe
            (
              startWith(0),
              map((period) => [ period, refreshRate, machine ]),
            ) : of([ null, null, null ]),
          ),
        ),
      )

    this.periodCounter$ = livePeriodRefreshRateAndMachine$.pipe(
      map(([ period, refreshRate, machine ]) => ([ period, refreshRate / 1000, machine ])),
      map(([ period, refreshRate, machine ]) => machine ? (refreshRate - period % refreshRate).toString(10) : refreshRate.toString()))

    const live$ = livePeriodRefreshRateAndMachine$.pipe(
      map(([ period, refreshRate, machine ]) => ([ period === 0 || period * 1000 % refreshRate === 0, machine ])),
    )

    this.currentLiveState$ = live$.pipe
                                  (
                                    filter(([ zeroReached, machine ]) => zeroReached || !machine),
                                    switchMap(([ zeroReached, machine ]) =>
                                      machine ? this.influxService.getCurrentState(machine) : of(null)),
                                    share(),
                                  )

    this.currentLivePower$ = live$.pipe
                                  (
                                    filter(([ zeroReached, machine ]) => zeroReached || !machine),
                                    switchMap(([ zeroReached, machine ]) =>
                                      zeroReached && machine ? this.influxService.getCurrentPower(machine) : of(null)),
                                    map(power => power == null ? null : `${power} W`),
                                    share(),
                                  )

    this.livePower5Min$ = live$.pipe
                               (
                                 filter(([ zeroReached, machine ]) => zeroReached || !machine),
                                 switchMap(([ zeroReached, machine ]) =>
                                   machine ? this.influxService.getPowerLast5Min(machine) : of(null)),
                                 share(),
                               )

  }

  private initHistoryView() {
    this.isHistoryTableDataVisible$ = combineLatest(
      this.currentHistoryMachine$,
      this.historyStartDate$,
      this.historyStartTime$,
      this.historyEndTime$,
    )
      .pipe
      (
        map(([
               currentHistoryMachine,
               historyStartDate,
               historyStartTime,
               historyEndTime,
             ]) => !!currentHistoryMachine && !!historyStartDate && !!historyStartTime && !!historyEndTime))

    this.historyTableData$ = combineLatest(
      this.currentHistoryMachine$,
      this.historyStartDate$,
      this.historyStartTime$,
      this.historyEndTime$,
    )
      .pipe
      (
        filter(([
                  currentHistoryMachine,
                  historyStartDate,
                  historyStartTime,
                  historyEndTime,
                ]) => !!currentHistoryMachine && !!historyStartDate && !!historyStartTime && !!historyEndTime),
        switchMap(([
                     currentHistoryMachine,
                     historyStartDate,
                     historyStartTime,
                     historyEndTime,
                   ]) => this.influxService.getStateTransitions(
          currentHistoryMachine,
          this.combineDateAndTime(historyStartDate, historyStartTime),
          this.combineDateAndTime(historyStartDate, historyEndTime),
        )),
        map(result => groupBy(result, r => r.state)),
        map((result: { [ key: number ]: { auc: number, state: number } }) =>
          Object.keys(result)
                .map(key => ({
                  state: key,
                  power: reduce(result[ key ], (acc, value) => acc + value.auc, 0),
                })),
        ),
      )

    this.historyPieData$ = this.historyTableData$.pipe(map(result => result.map(x => x.power)))
    this.historyPieLabels$ = this.historyTableData$.pipe(map(result => result.map(x => `State ${x.state}`)))
  }

  private combineDateAndTime(date: Date, time: string) {
    const timeString = `${time}:00`
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dateString = `${year}-${month}-${day}`
    return new Date(`${dateString} ${timeString}`)
  };
}
