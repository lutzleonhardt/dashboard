import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'vw-tile',
  templateUrl: './tile.component.html',
  styleUrls: [ './tile.component.scss' ],
})

export class TileComponent implements OnInit {
  @Input()
  public machine: string | null = null

  @Input()
  public title: string | null = null

  @Input()
  public icon: string | null = null

  @Input()
  public value: string | null = null

  public constructor() { }

  public ngOnInit() { }
}
