export class Score {
  result: string;
  classifier: string;
  tableId: number;


  constructor(result: string, classifier: string, tableId: number) {
    this.result = result;
    this.classifier = classifier;
    this.tableId = tableId;
  }
}
