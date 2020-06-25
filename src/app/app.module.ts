import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MaterialModule} from './material/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ServerService} from './services/server.service';
import {UtilService} from './services/util.service';
import {HttpClientModule} from '@angular/common/http';
import {SessionService} from './services/session.service';
import { LogoutComponent } from './logout/logout.component';
import { MonitorComponent } from './monitor/monitor.component';
import { SettingsComponent } from './settings/settings.component';
import { PatientComponent } from './patient/patient.component';
import { CholesterolChartComponent } from './cholesterol-chart/cholesterol-chart.component';
import { HighBpTextComponent } from './high-bp-text/high-bp-text.component';
import { HighBpChartComponent } from './high-bp-chart/high-bp-chart.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		DashboardComponent,
		LogoutComponent,
		MonitorComponent,
		SettingsComponent,
		PatientComponent,
		CholesterolChartComponent,
		HighBpTextComponent,
		HighBpChartComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MaterialModule,
		ReactiveFormsModule
	],
	providers: [
		ServerService, UtilService, SessionService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
