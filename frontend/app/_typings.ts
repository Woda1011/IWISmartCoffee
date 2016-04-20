export interface Credentials {
  username: string;
  password: string;
}

export interface User {
  firstName: string;
  lastName: string;
  hskaId: string;
  roles: string[];
}

export interface Telemetry {
  id?: number;
  temperature?: number;
  humidity?: number;
  createdAt?: any;
}

export interface CoffeeLog {
  quota?: number;
  averageConsumption?: number;
}
