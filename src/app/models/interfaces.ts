export interface Practitioner { //Practitioner
	id: number;
	identifier: string;
	name: string;
}

export interface Patient {
	id: number;
	name: string;
	cholesterol?: number;
	cholesterolUnit?: string;
	effectiveDate?: string;
	cholesterolLevel?: "high" | "normal" | "low";
	sysBloodPressure?: number;
	diasBloodPressure?: number;
	bpUnit?: string;
	bpEffectiveDate?: string;
	bpLevel?: "high" | "normal" | "low";
	lastUpdate?: string;
	isMonitored?: boolean;
	isCholMonitored?: boolean;
	isBpMonitored?: boolean;
	isLoading?: boolean;
	isBpLoading?: boolean;
}

export interface SettingsModel {
	updateInterval: number;
	intervalUnit: "seconds" | "minutes" | "hours";
	highSystolic: number;
	highDiastolic: number;
}

export interface MonitoredPatient {
	name: string;
	dateOfBirth: string;
	gender: string;
	address: string;
	city: string;
	state: string;
	country: string;
}

export interface MonitorView {
	mode: "table" | "cholesterolChart" | "highBpText" | "highBpChart";
}
