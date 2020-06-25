import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {UtilService} from '../services/util.service';
import {ServerService} from '../services/server.service';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {SessionService} from '../services/session.service';
import {Patient, Practitioner} from '../models/interfaces';
import {MonitorComponent} from '../monitor/monitor.component';
import {MatDrawer} from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

	practitioner: Practitioner;

	isLoading: boolean = false;

	tableDataSource: MatTableDataSource<Patient>;

	displayedColumns = ['counter', 'name', 'action'];

	@ViewChild(MonitorComponent) monitor: MonitorComponent;
	@ViewChild(MatDrawer, {static: true}) draw: MatDrawer;

	isViewInit: boolean = false;

	constructor(
		private utilService: UtilService,
		private server: ServerService,
		private session: SessionService,
		private router: Router
	) { }

	ngAfterViewInit(): void {
        this.isViewInit = true;
    }

	ngOnInit(): void {
		this.practitioner = this.session.getCurrentUser;

		if(this.practitioner == null) {
			this.router.navigateByUrl("/");
		}
		else {
			this.loadPatients();
		}
	}

	loadPatients() {
		this.isLoading = true;
		this.server.getPatients(this.practitioner.identifier).subscribe(response => {
			let patients: Patient[] = []; // To hold all returned patients including duplicates
			response.entry.forEach(entry => {
				let id = entry.resource.subject.reference.replace("Patient/", "");
				let name = entry.resource.subject.display;
				let patient: Patient = {
					id: id,
					name: name
				};

				patients.push(patient);
			});

			//Remove duplicates and populate table
			this.tableDataSource = new MatTableDataSource<Patient>(this.getUniquePatientsFromEncounters(patients))

			this.isLoading = false;

		}, error => {
			this.utilService.serverErrorNotice(error);
		})
	}

	getUniquePatientsFromEncounters(patients: Patient[]): Patient[] {
		let uniquePatientsSet: Set<string> = new Set<string>();

		patients.forEach(patient => {
			uniquePatientsSet.add(JSON.stringify(patient));
		});

		let uniquePatientsArray: Patient[] = [];

		uniquePatientsSet.forEach(patient => {
			uniquePatientsArray.push(JSON.parse(patient));
		});

		return  uniquePatientsArray;
	}

	monitorPatient(mode: string, patient: Patient) {
		this.tableDataSource.data[this.getPatientIndex(patient)].isMonitored = true;

		if(mode == "cholesterol") {
			this.tableDataSource.data[this.getPatientIndex(patient)].isCholMonitored = true;
			this.tableDataSource.data[this.getPatientIndex(patient)].isLoading = true;
		}
		else if(mode == "bp") {
			this.tableDataSource.data[this.getPatientIndex(patient)].isBpMonitored = true;
			this.tableDataSource.data[this.getPatientIndex(patient)].isBpLoading = true;
		}
		else if(mode == "both") {
			this.tableDataSource.data[this.getPatientIndex(patient)].isCholMonitored = true;
			this.tableDataSource.data[this.getPatientIndex(patient)].isLoading = true;
			this.tableDataSource.data[this.getPatientIndex(patient)].isBpMonitored = true;
			this.tableDataSource.data[this.getPatientIndex(patient)].isBpLoading = true;
		}

		this.tableDataSource._updateChangeSubscription();

		if(!this.monitor.addPatient(this.tableDataSource.data[this.getPatientIndex(patient)])) {
			this.unmonitorPatient(this.tableDataSource.data[this.getPatientIndex(patient)]);
		}
	}

	unmonitorPatient(patient: Patient) {
		this.tableDataSource.data[this.getPatientIndex(patient)].isMonitored = false;
		this.tableDataSource.data[this.getPatientIndex(patient)].isCholMonitored = false;
		this.tableDataSource.data[this.getPatientIndex(patient)].isBpMonitored = false;
		this.tableDataSource.data[this.getPatientIndex(patient)].isLoading = false;
		this.tableDataSource._updateChangeSubscription();
	}

	getPatientIndex(patient: Patient): number {
		for(let i = 0; i < this.tableDataSource.data.length; i++) {
			if(this.tableDataSource.data[i].id == patient.id) {
				return i;
			}
		}
	}
}
