export interface RecordConditionData {
  id: string;
  name: RecordCondition;
}

export enum RecordCondition {
  New = "New",
  LikeNew = "Like New",
  VeryGood = "Very Good",
  Good = "Good",
  Fair = "Fair",
}
