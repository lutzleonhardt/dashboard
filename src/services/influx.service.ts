import { Injectable } from '@angular/core'
import { FieldType, InfluxDB } from 'influx'
import { formatDate } from 'influx/lib/src/grammar/times'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { uniq, reverse } from 'lodash'

@Injectable()
export class InfluxService {

  private influxDb: InfluxDB | null = null

  public constructor() {
    this.openDb()
  }

  public getAllMachines(): Observable<string[]> {
    const promise = this.influxDb.query<{ key: string, value: string }>('show tag values with key = "id"')
    return from(promise)
      .pipe(
        map(keyValueTuples => uniq(keyValueTuples.map(keyValueTuple => keyValueTuple.value))),
      )
  }

  public getCurrentState(machine: string): Observable<string> {
    const promise = this.influxDb.query<{ state: string }>(
      `select value,state from "power-measurements" where id = '${machine}' order by time desc limit 1`)
    return from(promise)
      .pipe(
        map(keyValueTuples => keyValueTuples.length === 1 ? keyValueTuples[ 0 ].state : null),
      )
  }

  public getCurrentPower(machine: string): Observable<string> {
    const promise = this.influxDb.query<{ value: number }>(
      `select value from "power-measurements" where id = '${machine}' order by time desc limit 1`)
    return from(promise)
      .pipe(
        map(keyValueTuples => keyValueTuples.length === 1 ? keyValueTuples[ 0 ].value.toFixed(2)
                                                                               .toString() : null),
      )
  }

  public getPowerLast5Min(machine: string): Observable<number[]> {
    const promise = this.influxDb.query<{ value: number }>(
      `select value from "power-measurements" where id = '${machine}' and time >= now() - 5m order by time desc limit 100`)
    return from(promise)
      .pipe(
        map(keyValueTuples => keyValueTuples.map(keyValueTuple => keyValueTuple.value)),
        map(result => reverse(result)),
      )
  }

  public getStateTransitions(machine: string, startDate: Date, endDate: Date): Observable<{ auc: number, state: string }[]> {
    const promise = this.influxDb.query<{ auc: number, state: string }>(
      `select state,auc from "state-transitions" where id = '${machine}' and time >= ${formatDate(startDate)
        .replace(/"/g, '\'')} and time <= ${formatDate(
        endDate)
        .replace(/"/g, '\'')}`)
    return from(promise)
      .pipe(
        map(keyValueTuples => keyValueTuples.map(keyValueTuple => ({
          auc: keyValueTuple.auc,
          state: keyValueTuple.state,
        }))),
        map(result => reverse(result)),
      )
  }

  private openDb() {
    this.influxDb = new InfluxDB({
      host: '52.232.104.170',
      database: 'mydb',
      schema: [
        {
          measurement: 'power-measurements',
          fields: {
            value: FieldType.FLOAT,
          },
          tags: [
            'id', 'state',
          ],
        },
        {
          measurement: 'state-transitions',
          fields: {
            state: FieldType.STRING,
            auc: FieldType.FLOAT,
          },
          tags: [ 'id', 'state' ],
        },
      ],
    })
  }
}
