import {HttpHeaders} from '@angular/common/http';
import {SettingsModel} from './models/interfaces';

export class Config {
	static SERVER_URL = "https://fhir.monash.edu/hapi-fhir-jpaserver/fhir";

	static HTTP_CONFIG: object = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store',
		})
	};

	static SNACKBAR_TIMEOUT: number = 3000;

	static DEFAULT_SETTINGS: SettingsModel = {
		updateInterval: 5,
		intervalUnit: 'seconds',
		highSystolic: 140,
		highDiastolic: 90
	}
}
