import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ServerService} from '../services/server.service';
import {UtilService} from '../services/util.service';
import {MonitoredPatient} from '../models/interfaces';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
	isLoading: boolean = false;

	@Input() patientId: number;

	@Output() back: EventEmitter<any> = new EventEmitter<any>();

	patient: MonitoredPatient;

	constructor(
		private server: ServerService,
		private util: UtilService
	) { }

	ngOnInit(): void {
		this.getData();
	}

	getData() {
		this.isLoading = true;
		this.server.getPatient(this.patientId).subscribe(response => {
			let data: MonitoredPatient = {
				name: response.name[0].prefix[0] + " " + response.name[0].given[0] + " " + response.name[0].family +
					(response.name[0].suffix != undefined ? ', ' + response.name[0].suffix[0] : ''),
				dateOfBirth: response.birthDate,
				gender: response.gender,
				address: response.address[0].line[0],
				city: response.address[0].city,
				state: response.address[0].state,
				country: response.address[0].country
			};

			this.patient = data;

			this.isLoading = false;
		}, error => {
			this.util.serverErrorNotice();
			console.log(error);
		})
	}

}
