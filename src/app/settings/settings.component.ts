import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SessionService} from '../services/session.service';
import {SettingsModel} from '../models/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '../services/util.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

	settingsForm: FormGroup;

	@Output() applySettings: EventEmitter<any> = new EventEmitter<any>();

	constructor(
		private session: SessionService,
		private util: UtilService
	) { }

	ngOnInit(): void {
		let settings: SettingsModel = this.session.getSettings();

		this.settingsForm = new FormGroup({
			updateInterval: new FormControl(settings.updateInterval, [Validators.required]),
			intervalUnit: new FormControl(settings.intervalUnit, [Validators.required]),
			highSystolic: new FormControl(settings.highSystolic, [Validators.required]),
			highDiastolic: new FormControl(settings.highDiastolic, [Validators.required])
		});
	}

	onApply() {
		let settings: SettingsModel = this.settingsForm.value;
		this.session.setSettings(settings);
		this.applySettings.emit();
		this.util.notify("New settings applied");
		this.settingsForm.markAsPristine();
	}

}
