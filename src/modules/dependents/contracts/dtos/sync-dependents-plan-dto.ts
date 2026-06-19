export interface ISyncDependentsPlanDTO {
  holderId: string;
  planId: string | null;
  planExpiresAt: Date | string | null;
}
