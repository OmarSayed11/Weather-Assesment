import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { D3Service } from '../../../services/d3.service';

@Component({
  selector: 'app-d3-line-chart',
  standalone: true,
  template: `<div class="chart-container"></div>`,
  styleUrls: ['./d3-line-chart.component.css'],
})
export class D3LineChartComponent implements OnInit {
  @Input() data: any[] = []; // Initialize as an empty array

  constructor(private d3Service: D3Service, private el: ElementRef) {}

  ngOnInit() {
    if (this.data && this.data.length) {
      this.d3Service.createLineChart(
        this.data,
        this.el.nativeElement.querySelector('.chart-container')
      );
    }
  }
}
