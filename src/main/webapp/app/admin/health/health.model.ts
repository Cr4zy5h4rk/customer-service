export type HealthStatus = 'UP' | 'DOWN' | 'UNKNOWN' | 'OUT_OF_SERVICE';

export type HealthKey =
  | 'binders'
  | 'discoveryComposite'
  | 'refreshScope'
  | 'clientConfigServer'
  | 'hystrix'
  | 'consul'
  | 'diskSpace'
  | 'ssl'
  | 'mail'
  | 'ping'
  | 'livenessState'
  | 'readinessState'
  | 'elasticsearch'
  | 'db';

export interface HealthModel {
  status: HealthStatus;
  components?: Partial<Record<HealthKey, HealthDetails>>;
}

export interface HealthDetails {
  status: HealthStatus;
  details?: Record<string, unknown>;
}
