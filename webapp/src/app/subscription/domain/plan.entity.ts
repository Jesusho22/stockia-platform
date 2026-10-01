export class Plan {
  constructor(
    public id: number,
    public name: string,
    public monthlyPrice: number,
    public features: string[],
    public highlighted: boolean = false,
  ) {}

  static fromJson(json: any): Plan {
    return new Plan(json.id, json.name, json.monthlyPrice, json.features ?? [], json.highlighted ?? false);
  }
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
}

// Entidad Subscription vinculada al Plan activo del restaurante (US31)
export class Subscription {
  constructor(
    public id: number,
    public planId: number,
    public status: SubscriptionStatus,
    public renewalDate: string,
    public paymentMethod: 'STRIPE' | 'PAYPAL',
  ) {}

  static fromJson(json: any): Subscription {
    return new Subscription(json.id, json.planId, json.status, json.renewalDate, json.paymentMethod);
  }
}
