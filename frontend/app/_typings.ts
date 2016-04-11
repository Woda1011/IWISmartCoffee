export interface Credentials {
  username: string;
  password: string;
}

export interface Student {
  firstName: string;
  lastName: string;
  hskaId: string;
  roles: string[];
}

export interface Telemetry{
  id:number;
  temperature: number;
  humidity: number;
  createdAt: number;
}
