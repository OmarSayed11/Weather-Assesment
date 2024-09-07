import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root',
})
export class D3Service {
  createLineChart(data: any[], element: HTMLElement): void {
    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', 500)
      .attr('height', 300);

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Compute the extent of the data, ensuring no undefined values
    const xExtent = d3.extent(data, (d: any) => new Date(d.date));
    const yExtent = [0, d3.max(data, (d: any) => d.value)] as [number, number];

    // Set domains with default values if extent is undefined
    x.domain(
      xExtent && xExtent[0] && xExtent[1] ? xExtent : [new Date(), new Date()]
    );
    y.domain(
      yExtent[0] !== undefined && yExtent[1] !== undefined ? yExtent : [0, 0]
    );

    // Add X-axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

    // Add Y-axis
    g.append('g').call(d3.axisLeft(y).ticks(5));

    // Add line path
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line()
          .x((d: any) => x(new Date(d.date)))
          .y((d: any) => y(d.value))
      );
  }
}
