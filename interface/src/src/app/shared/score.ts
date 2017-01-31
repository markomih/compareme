export class Score {
  result: string;
  classifier: string;
  tableId: string;


  constructor(result: string, classifier: string, tableId: string) {
    this.result = result;
    this.classifier = classifier;
    this.tableId = tableId;
  }
}
