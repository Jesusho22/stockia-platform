// Enum compartido Front-End/Dominio (ver 4.6.5 y 4.7.1 del informe: mismo AlertType en ambas capas)
export enum AlertType {
  LOW_STOCK = 'LOW_STOCK',
  EXPIRING_SOON = 'EXPIRING_SOON',
  IOT_FAULT = 'IOT_FAULT',
  CRITICAL_STOCK = 'CRITICAL_STOCK',
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export const ALERT_TYPE_LABEL: Record<AlertType, string> = {
  [AlertType.LOW_STOCK]: 'Stock bajo',
  [AlertType.EXPIRING_SOON]: 'Por vencer',
  [AlertType.IOT_FAULT]: 'Falla de equipo (IoT)',
  [AlertType.CRITICAL_STOCK]: 'Stock crítico',
};

export type AlertChannel = 'WHATSAPP' | 'EMAIL';

// Aggregate Root Alert (US26, US28).
// Según 4.6.5, una Alert solo debe marcarse como entregada (evento de dominio `AlertDelivered`)
// tras un intento de entrega EXITOSO, y las alertas CRITICAL deben intentar entrega multicanal
// (WhatsApp + correo) antes de considerarse gestionadas. Se modela con `deliveredChannels`
// (canales por los que ya hubo un intento exitoso) en vez de un único `channel` fijo, para poder
// distinguir "intentado en 1 de 2 canales requeridos" de "entregado". `channel` se mantiene como
// el canal principal/configurado (compatibilidad con el fake API), y `deliveredChannels` por
// defecto asume que ese canal principal ya tuvo un primer intento exitoso.
export class Alert {
  constructor(
    public id: number,
    public type: AlertType,
    public severity: AlertSeverity,
    public message: string,
    public createdAt: string,
    public acknowledged: boolean,
    public channel: AlertChannel = 'WHATSAPP',
    public deliveredChannels: AlertChannel[] = [],
  ) {}

  /** Canales que el dominio exige agotar para esta alerta según su severidad (4.6.5). */
  get requiredChannels(): AlertChannel[] {
    return this.severity === AlertSeverity.CRITICAL ? ['WHATSAPP', 'EMAIL'] : [this.channel];
  }

  /** Canal requerido que todavía no tuvo un intento de entrega exitoso, si lo hay. */
  get pendingChannel(): AlertChannel | null {
    return this.requiredChannels.find((c) => !this.deliveredChannels.includes(c)) ?? null;
  }

  /**
   * True solo cuando se completó un intento de entrega exitoso en TODOS los canales requeridos
   * (equivale a que el dominio haya publicado `AlertDelivered`). Para alertas CRITICAL esto exige
   * WhatsApp + correo; para el resto, solo su canal configurado.
   */
  get delivered(): boolean {
    return this.pendingChannel === null;
  }

  static fromJson(json: any): Alert {
    const channel: AlertChannel = json.channel ?? 'WHATSAPP';
    return new Alert(
      json.id,
      json.type,
      json.severity,
      json.message,
      json.createdAt,
      json.acknowledged,
      channel,
      json.deliveredChannels ?? [channel],
    );
  }
}
