export interface ForecastDataPoint {
  date: string;
  dayLabel: string;
  dishName: string;
  projectedUnits: number;
}

// Aggregate Root DemandForecast (US24, ver Capítulo IV 4.6.5).
// Los Value Objects documentados (ConfidenceScore, WeatherCondition, DateRange) se representan
// como campos primitivos (confidenceScore, weatherCondition, dataPoints[].date) dentro del propio
// agregado, siguiendo la misma variación aceptada que el resto del proyecto (ver product-inventory)
// en vez de clases VO separadas. Los Domain Events DemandForecastGenerated/DemandForecastOutdated
// no se modelan como clases porque no hay backend real que los publique en este Sprint; `generate()`
// en forecast.service.ts documenta la intención de ForecastGenerationService.
export class DemandForecast {
  constructor(
    public id: number,
    public generatedAt: string,
    public confidenceScore: number,
    public weatherCondition: string,
    public dataPoints: ForecastDataPoint[],
  ) {}

  static fromJson(json: any): DemandForecast {
    return new DemandForecast(json.id, json.generatedAt, json.confidenceScore, json.weatherCondition, json.dataPoints ?? []);
  }
}
