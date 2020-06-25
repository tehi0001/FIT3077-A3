import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Patient} from "../models/interfaces";
import {SessionService} from "../services/session.service";
import {ServerService} from "../services/server.service";
import { Chart } from 'chart.js';
import {UtilService} from "../services/util.service";


interface BpData {
	systolic: number;
	effectiveDate: string;
}

interface ChartData {
	patientId: number;
	patientName: string;
	data: BpData[]
}

@Component({
  selector: 'app-high-bp-chart',
  templateUrl: './high-bp-chart.component.html',
  styleUrls: ['./high-bp-chart.component.scss']
})
export class HighBpChartComponent implements OnInit, AfterViewInit {

	@Input() patients: Patient[];

	chartData: ChartData[] =[];

	isLoading: boolean = false;


	constructor(private session: SessionService, private server: ServerService, private utilService: UtilService) { }

	ngOnInit(): void {
		this.patients.forEach((patient, index) => {
			if(patient.sysBloodPressure > this.session.getSettings().highSystolic) {
				this.isLoading = true;

				let data: ChartData = {
					patientId: patient.id,
					patientName: patient.name,
					data: []
				}

				this.server.getBloodPressure(patient.id, 5).subscribe(response => {
					response.entry.forEach(entry => {
						data.data.push({
							systolic: entry.resource.component[1].valueQuantity.value,
							effectiveDate: entry.resource.effectiveDateTime
						})
					});
					data.data.reverse();
					this.chartData.push(data);

					if(index == this.patients.length - 1) {
						this.isLoading = false;
					}
				})
			}
		})
	}

	drawCharts() {
		if(this.chartData.length == 0 && this.isLoading) {
			setTimeout(() => {
				this.drawCharts();
			}, 500);
		}
		else {
			this.chartData.forEach(chart => {
				let labels = [], dataset = [];
				chart.data.forEach(item => {
					let date = new Date(item.effectiveDate);
					labels.push(date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes());
					dataset.push(item.systolic);
				})
				let bpChart = new Chart('' + chart.patientId, {
					type: 'line',
					data: {
						datasets: [{
							data: dataset,
							backgroundColor: 'rgba(0, 0, 0, 0)',
							pointBackgroundColor: this.utilService.generateRandomRgbColor(),
							borderColor: this.utilService.generateRandomRgbColor()
						}],
						labels: labels
					},
					options: {
						legend: {
							display: false
						},
						scales: {
							yAxes: [{
								ticks: {
									suggestedMin: this.session.getSettings().highSystolic
								}
							}]
						},
					}
				})
			})
		}
	}

	ngAfterViewInit(): void {
		this.drawCharts();
	}

}
