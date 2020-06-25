import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Config} from '../config';
import {Patient} from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

	constructor(private snackBar: MatSnackBar) { }

	notify(message: string) {
		this.snackBar.open(message, "OK", {
			duration: Config.SNACKBAR_TIMEOUT
		})
	}

	serverErrorNotice(error?: any) {
		console.log(error);
		if(error != undefined && error.status == 0) {
			this.notify("Server unreachable. Try again later");
		}
		else {
			this.notify("An unknown server error occurred");
		}
	}

	getAverageCholesterol(patients: Patient[]): number {
		let total: number = 0;
		patients.forEach((patient) => {
			total += patient.cholesterol;
		});

		return total / patients.length;
	}
	generateRandomRgbColor(): string {
		let randomRGB = () => {
			return Math.floor(Math.random() * 256);
		}

		return 'rgb(' + randomRGB() + ', ' + randomRGB() + ', ' + randomRGB() + ')';
	}
}
