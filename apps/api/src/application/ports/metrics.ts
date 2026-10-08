export interface HttpRequestMeasurement {
  readonly durationSeconds: number;
  readonly method: string;
  readonly route: string;
  readonly statusCode: number;
}

export interface Metrics {
  readonly contentType: string;
  observeHttpRequest(measurement: HttpRequestMeasurement): void;
  serialize(): Promise<string>;
}
