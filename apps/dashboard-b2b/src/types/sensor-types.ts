export interface SwitchSensorType {
	state: boolean;
	timestamp: string;
	device: string;
	userId: string;
	email: string;
}

export interface PowerSensorType {
	voltage: number;
	current: number;
	power: number;
	frequency: number;
	powerFactor: number;
	sensor: string;
	phase: string;
	enabled: boolean;
	monitoring: boolean;
	userId: string;
	email: string;
	timestamp: string;

}

export interface WaterSensorType {
	level: number;
	capacity: number;
	status: string;
	sensor: string;
	location: string;
	enabled: boolean;
	alertsEnabled: boolean;
	userId: string;
	email: string;
	timestamp: string;
}

export interface TemperatureSensorType {
	temperature: number;
	humidity: number;
	sensor: string;
	location: string;
	enabled: boolean;
	userId: string;
	email: string;
	timestamp: string;
}
