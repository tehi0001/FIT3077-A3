import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '../services/util.service';
import {ServerService} from '../services/server.service';
import {Router} from '@angular/router';
import {SessionService} from '../services/session.service';
import {Practitioner} from '../models/interfaces';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	isBusy: boolean = false;

	loginForm: FormGroup;

	constructor(
		private utilService: UtilService,
		private server: ServerService,
		private session: SessionService,
		private router: Router
	) { }

	ngOnInit(): void {

		this.loginForm = new FormGroup({
			id: new FormControl('', [Validators.required]),
			remember: new FormControl()
		});

		let rememberedId = localStorage.getItem("rememberedId");

		if(rememberedId != null) {
			this.loginForm.controls.id.setValue(rememberedId);
			this.loginForm.controls.remember.setValue(true);
		}
	}

	login() {
		this.isBusy = true;
		this.server.getPractitioner(this.loginForm.value.id).subscribe(response => {
			if(this.loginForm.value.remember) {
				localStorage.setItem("rememberedId", this.loginForm.value.id);
			}
			else {
				localStorage.removeItem("rememberedId");
			}

			let user: Practitioner = {
				id: response.id,
				identifier: response.identifier[0].system + "|" + response.identifier[0].value,
				name: response.name[0].prefix[0] + " " + response.name[0].given[0] + " " + response.name[0].family
			}

			this.session.setCurrentUser(user);

			this.router.navigateByUrl("/dashboard");

			this.isBusy = false;

		}, error => {
			if(error.status == 404) {
				this.utilService.notify("Practitioner ID does not exist");
			}
			else {
				this.utilService.serverErrorNotice(error);
			}
			this.isBusy = false;
		})
	}
}
