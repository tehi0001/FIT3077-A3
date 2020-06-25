import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Config} from '../config';

@Injectable({
	providedIn: 'root'
})
export class ServerService {

	constructor(private http: HttpClient) {}

	getPractitioner(id: number): Observable<any> {
		let url = Config.SERVER_URL + "/Practitioner/" + id + "/?_format=json";
		return this.http.get(url, Config.HTTP_CONFIG);
	}

	getPatients(practitionerId: string): Observable<any> {
		let url = Config.SERVER_URL + "/Encounter/?participant.identifier=" + practitionerId + "&_include=Encounter.participant.individual&_include=Encounter.patient";
		return this.http.get(url, Config.HTTP_CONFIG);
	}

	getPatient(id: number): Observable<any> {
		let url = Config.SERVER_URL + "/Patient/" + id + "/?_format=json";
		return this.http.get(url, Config.HTTP_CONFIG);
	}

	getCholesterol(patientId: number): Observable<any> {
		let url = Config.SERVER_URL + "/Observation/?patient=" + patientId + "&code=2093-3&_sort=-date&_count=1";
		return this.http.get(url, Config.HTTP_CONFIG);
	}

	getBloodPressure(patientId: number, count: number = 1): Observable<any> {
		let url = Config.SERVER_URL + "/Observation/?patient=" + patientId + "&code=55284-4&_sort=-date&_count=" + count;
		return this.http.get(url, Config.HTTP_CONFIG);
	}

}
