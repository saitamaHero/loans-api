export enum DurationUnit {
  MONTHS = 'months',
  YEARS = 'years',
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum PaymentType {
  NORMAL = 'normal',
  EXTRA = 'extra', // extra payment towards principal
}

export enum AmortizationStatus {
  PENDING = 'pending',
  PAID = 'paid',
}
