export interface Credentials {
  username: string;
  password: string;
}

export interface Student {
  firstName: string;
  lastName: string;
  hskaId: string;
  campusCardId?: string;
  hasCampusCardMapped?: boolean;
  roles: string[];
}

export interface Telemetry {
  id?: number;
  temperature?: number;
  fillLevel?: number;
  isBrewing?: boolean;
  createdAt?: any;
}

export interface CoffeeLog {
  quota?: number;
  averageConsumption?: number;
}
