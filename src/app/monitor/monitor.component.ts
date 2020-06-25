import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MonitorView, Patient} from '../models/interfaces';
import {ServerService} from '../services/server.service';
import {UtilService} from '../services/util.service';
import {Observable} from 'rxjs';
import {SessionService} from '../services/session.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit, OnDestroy {
	tableDataSource: MatTableDataSource<Patient>;
	displayedColumns: string[] = ['counter', 'name', 'cholesterol', 'cholEffectiveDate', 'sysBloodPressure', 'diasBloodPressure', 'bpEffectiveDate', 'lastUpdate', 'action'];

	@Output() remove: EventEmitter<Patient> = new EventEmitter();

	isRunning: boolean = false;
	isUpdating: boolean = false;
	isInitializing: boolean = false;

	showViewPatient: boolean = false;
	patientIdToView: number;

	monitorView: MonitorView = {
		mode: "table"
	};

	constructor(
		private server: ServerService,
		private util: UtilService,
		private session: SessionService
	) {}

	ngOnInit(): void {
		this.tableDataSource = new MatTableDataSource<Patient>([]);
	}

	addPatient(patient: Patient): boolean {
		this.showViewPatient = false;
		this.monitorView.mode = "table";
		if(patient == null || this.isUpdating || this.isInitializing) {
			this.util.notify("System is busy. Try again shortly.");
			return false;
		}

		this.tableDataSource.data.push(patient);
		this.tableDataSource._updateChangeSubscription();

		let index = this.tableDataSource.data.length - 1;
		this.isInitializing = true;

		if(patient.isCholMonitored && patient.isBpMonitored) {
			this.updateCholesterolDataInTable(patient, index).subscribe(() => {
				this.updateBpDataInTable(patient, index).subscribe(() => {
					this.isInitializing = false;
					if(!this.isRunning) {
						this.run();
					}
				}, error => {
					this.isInitializing = false;
					this.removePatient(patient, index);
				})
			}, error => {
				patient.isLoading = false;
				patient.isCholMonitored = false;
				this.updateBpDataInTable(patient, index).subscribe(() => {
					this.isInitializing = false;
					if(!this.isRunning) {
						this.run();
					}
				}, error => {
					this.isInitializing = false;
					this.removePatient(patient, index);
				})
			})
		}

		else if(patient.isCholMonitored) {
			this.updateCholesterolDataInTable(patient, index).subscribe(() => {
				this.isInitializing = false;
				if(!this.isRunning) {
					this.run();
				}
			}, () => {
				this.isInitializing = false;
				this.removePatient(patient, index);
			});
		}
		else if(patient.isBpMonitored) {
			this.updateBpDataInTable(patient, index).subscribe(() => {
				this.isInitializing = false;
				if(!this.isRunning) {
					this.run();
				}
			}, () => {
				this.isInitializing = false;
				this.removePatient(patient, index);
			});
		}

		return true;
	}

	updateCholesterolDataInTable(patient: Patient, index: number): Observable<any> {
		return new Observable(observer => {
			this.getCholesterolData(patient, index).subscribe(() => {
				observer.next();
			}, () => {
				observer.error();
			});
		})
	}

	updateBpDataInTable(patient: Patient, index: number): Observable<any> {
		return new Observable(observer => {
			this.getBloodPressureData(patient, index).subscribe(() => {
				observer.next();
			}, () => {
				observer.error();
			});
		})
	}

	removePatient(patient: Patient, index: number) {
		this.tableDataSource.data.splice(index, 1);
		this.tableDataSource._updateChangeSubscription();

		if(this.tableDataSource.data.length == 0) {
			this.isRunning = false;
			this.isUpdating = false;
		}
		this.remove.emit(patient);
	}

	getCholesterolData(patient: Patient, index: number): Observable<any> {
		return new Observable(observer => {
			this.server.getCholesterol(patient.id).subscribe(response => {
				if (response.entry == undefined) {
					this.util.notify("ERROR: No cholesterol observations for " + patient.name);
					observer.error();
				} else {
					this.tableDataSource.data[index].cholesterol = response.entry[0].resource.valueQuantity.value;
					this.tableDataSource.data[index].cholesterolUnit = response.entry[0].resource.valueQuantity.unit;
					this.tableDataSource.data[index].effectiveDate = response.entry[0].resource.issued;
					this.tableDataSource.data[index].lastUpdate = (new Date()).toString();
					this.tableDataSource.data[index].isMonitored = true;
					this.tableDataSource.data[index].isLoading = false;

					if(this.tableDataSource.data[index].cholesterol > this.util.getAverageCholesterol(this.tableDataSource.data)) {
						this.tableDataSource.data[index].cholesterolLevel = 'high';
					}

					observer.next();
				}
			});
		})
	}

	getBloodPressureData(patient: Patient, index: number): Observable<any> {
		return new Observable(observer => {
			this.server.getBloodPressure(patient.id).subscribe(response => {
				if (response.entry == undefined) {
					this.util.notify("ERROR: No blood pressure observations for " + patient.name);
					observer.error();
				} else {
					this.tableDataSource.data[index].sysBloodPressure = response.entry[0].resource.component[1].valueQuantity.value;
					this.tableDataSource.data[index].diasBloodPressure = response.entry[0].resource.component[0].valueQuantity.value;
					this.tableDataSource.data[index].bpUnit = response.entry[0].resource.component[1].valueQuantity.unit;;
					this.tableDataSource.data[index].bpEffectiveDate = response.entry[0].resource.effectiveDateTime
					this.tableDataSource.data[index].lastUpdate = (new Date()).toString();
					this.tableDataSource.data[index].isMonitored = true;
					this.tableDataSource.data[index].isBpLoading = false;

					if(this.tableDataSource.data[index].sysBloodPressure > this.session.getSettings().highSystolic || this.tableDataSource.data[index].diasBloodPressure > this.session.getSettings().highDiastolic) {
						this.tableDataSource.data[index].bpLevel = 'high';
					}

					observer.next();
				}
			});
		})
	}

	run() {
		this.isRunning = true;
		this.tableDataSource.data.forEach((patient, index) => {
			if(patient.isCholMonitored && patient.isBpMonitored) {
				this.isUpdating = true;
				this.updateCholesterolDataInTable(patient, index).subscribe(() => {
					this.updateBpDataInTable(patient, index).subscribe(() => {
						if(index == this.tableDataSource.data.length - 1) {
							this.tableDataSource._updateChangeSubscription();
							this.isUpdating = false;
							setTimeout(() => {
								if(this.isRunning) {
									this.run();
								}
							}, this.session.updateInterval);
						}
					})
				})
			}
			else if(patient.isCholMonitored) {
				this.isUpdating = true;
				this.updateCholesterolDataInTable(patient, index).subscribe(() => {
					if(index == this.tableDataSource.data.length - 1) {
						this.tableDataSource._updateChangeSubscription();
						this.isUpdating = false;
						setTimeout(() => {
							if(this.isRunning) {
								this.run();
							}
						}, this.session.updateInterval);
					}
				})
			}
			else if(patient.isBpMonitored) {
				this.isUpdating = true;
				this.updateBpDataInTable(patient, index).subscribe(() => {
					if(index == this.tableDataSource.data.length - 1) {
						this.tableDataSource._updateChangeSubscription();
						this.isUpdating = false;
						setTimeout(() => {
							if(this.isRunning) {
								this.run();
							}
						}, this.session.updateInterval);
					}
				})
			}
			else {
				this.isUpdating = false;
				setTimeout(() => {
					if(this.isRunning) {
						this.run();
					}
				}, this.session.updateInterval);
			}
		})
	}

	stopMonitorData(data: string, index: number) {
		if(data == "cholesterol") {
			this.tableDataSource.data[index].isCholMonitored = false;
			this.tableDataSource.data[index].isLoading = false;
			this.tableDataSource.data[index].cholesterol = 0;
			this.tableDataSource.data[index].cholesterolUnit = null;
			this.tableDataSource.data[index].cholesterolLevel = "normal";
		}
		else if(data == "bp") {
			this.tableDataSource.data[index].isBpMonitored = false;
			this.tableDataSource.data[index].sysBloodPressure = 0;
			this.tableDataSource.data[index].diasBloodPressure = 0;
			this.tableDataSource.data[index].bpUnit = null;
			this.tableDataSource.data[index].bpLevel = "normal";
		}
		this.tableDataSource._updateChangeSubscription();
	}

	startMonitorData(data: string, index: number) {
		if(data == "cholesterol") {
			this.tableDataSource.data[index].isCholMonitored = true;
			this.tableDataSource.data[index].isLoading = true;
			this.updateCholesterolDataInTable(this.tableDataSource.data[index], index).subscribe(() => {

			}, error => {
				this.tableDataSource.data[index].isLoading = false;
				this.tableDataSource.data[index].isCholMonitored = false;
			});
		}
		else if(data == "bp") {
			this.tableDataSource.data[index].isBpMonitored = true;
			this.tableDataSource.data[index].isBpLoading = true;
			this.updateBpDataInTable(this.tableDataSource.data[index], index).subscribe(() => {

			}, error => {
				this.tableDataSource.data[index].isBpLoading = false;
				this.tableDataSource.data[index].isBpMonitored = false;
			});
		}
		this.tableDataSource._updateChangeSubscription();
	}

	ngOnDestroy(): void {
		this.isRunning = false;
	}

	viewPatient(patient: Patient) {
		this.patientIdToView = patient.id;
		this.showViewPatient = true;
	}
}
