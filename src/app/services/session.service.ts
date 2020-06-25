import { Injectable } from '@angular/core';
import {SettingsModel, Practitioner} from '../models/interfaces';
import {Router} from '@angular/router';
import {Config} from '../config';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
	private currentUser: Practitioner = null;
	constructor(private router: Router) { }

	setCurrentUser(user: Practitioner) {
		this.currentUser = user;
		sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));
	}

	get getCurrentUser(): Practitioner {
		if(this.currentUser != null) {
			return  this.currentUser;
		}

		return JSON.parse(sessionStorage.getItem("currentUser"));
	}

	logOut() {
		sessionStorage.clear();
		this.currentUser = null;
		this.router.navigateByUrl("/login");
	}

	getSettings(): SettingsModel {
		let settings = sessionStorage.getItem("userSettings");

		if(settings == null) {
			return Config.DEFAULT_SETTINGS;
		}

		return JSON.parse(settings);
	}

	setSettings(settings: SettingsModel) {
		sessionStorage.setItem("userSettings", JSON.stringify(settings));
	}

	get updateInterval(): number {
		let settings = this.getSettings();
		let unit;

		if(settings.intervalUnit == 'seconds') {
			unit = 1000;
		}
		else if(settings.intervalUnit == 'minutes') {
			unit = 1000 * 60;
		}
		else if(settings.intervalUnit == 'hours') {
			unit = 1000 * 60 * 60;
		}

		return settings.updateInterval * unit;
	}
}
