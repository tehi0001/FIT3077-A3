import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { Chart } from 'chart.js';
import {Patient} from "../models/interfaces";
import {UtilService} from "../services/util.service";

@Component({
  selector: 'app-cholesterol-chart',
  templateUrl: './cholesterol-chart.component.html',
  styleUrls: ['./cholesterol-chart.component.scss']
})
export class CholesterolChartComponent implements OnInit, AfterViewInit {

	@Input() patients: Patient[];

	labels: string[] = [];
	bgColors: string[] = [];
	borderColors: string[] = []
	dataSet: number[] = [];

	constructor(private utilService: UtilService) { }

	ngOnInit(): void {
		this.patients.forEach(patient => {
			if(patient.isCholMonitored) {
				this.labels.push(patient.name);
				this.bgColors.push(this.utilService.generateRandomRgbColor());
				this.borderColors.push(this.utilService.generateRandomRgbColor());
				this.dataSet.push(patient.cholesterol);
			}
		})
	}

	drawChart() {
		let cholChart = new Chart('chart', {
			type: 'bar',
			data: {
				labels: this.labels,
				datasets: [{
					label: 'Total Cholesterol',
					data: this.dataSet,
					backgroundColor: this.bgColors,
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				},
				legend: {
					display: false
				}
			}
		});
	}

	ngAfterViewInit(): void {
		if(this.dataSet.length > 0) {
			this.drawChart();
		}
	}



}
