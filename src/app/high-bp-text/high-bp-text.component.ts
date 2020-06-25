import {Component, Input, OnInit} from '@angular/core';
import {Patient} from "../models/interfaces";
import {SessionService} from "../services/session.service";
import {ServerService} from "../services/server.service";

interface BpData {
	systolic: number;
	effectiveDate: string;
}

interface HistoricalData {
	patientName: string;
	data?: BpData[];
}

@Component({
  selector: 'app-high-bp-text',
  templateUrl: './high-bp-text.component.html',
  styleUrls: ['./high-bp-text.component.scss']
})
export class HighBpTextComponent implements OnInit {

	@Input() patients: Patient[];

	dataSet: HistoricalData[] = [];

	isLoading: boolean = false;

	constructor(private session: SessionService, private server: ServerService) { }

	ngOnInit(): void {
		this.patients.forEach((patient, index) => {
			if(patient.sysBloodPressure > this.session.getSettings().highSystolic) {
				this.isLoading = true;

				let historicalData: HistoricalData = {
					patientName: patient.name,
					data: []
				};

				this.server.getBloodPressure(patient.id, 5).subscribe(response => {
					response.entry.forEach(entry => {
						historicalData.data.push({
							systolic: entry.resource.component[1].valueQuantity.value,
							effectiveDate: entry.resource.effectiveDateTime
						});
					});
					historicalData.data.reverse();
					this.dataSet.push(historicalData);

					if(index == this.patients.length - 1) {
						this.isLoading = false
					}
				})
			}
		})
	}

}
