import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Orden } from 'src/app/models/orden.model';

@Component({
  selector: 'app-report-format',
  templateUrl: './report-format.component.html',
  styleUrls: ['./report-format.component.css']
})
export class ReportFormatComponent implements OnInit {


  @Input() item: any;


  @Output() DatosArray: EventEmitter<string[]> = new EventEmitter();
  @Output() orden: EventEmitter<Orden> = new EventEmitter();

  // variables


  // -------------------------------------------
  constructor() { }

  ngOnInit(): void {
  }

  // ----------metodos--------------------------






} // END class
