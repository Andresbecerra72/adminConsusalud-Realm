import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-utils-header',
  templateUrl: './calendar-utils.component.html'
})

export class CalendarUtilsComponent{

  @Input() view: CalendarView;

  @Input() viewDate: Date;

  @Input() locale: string = 'en';

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;



}
