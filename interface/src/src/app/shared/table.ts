export class Table {
  public id: string;
  public columns: Array<column> = [];
  public removedLabels: string[] = [];
  public classLabel: string = null;
  public tableName:string = null;
  public classifiers:string[];

  constructor(id: string, tableName:string) {
    this.id = id;
    this.tableName = tableName;
  }

  addTableColumn(label: string, values: string[]): void {
    this.columns.push({label: label, values: values});
  }

  size(): number {
    return this.columns.length;
  }

  print() {
    this.columns.forEach(element => {
      console.log(element.label);
      element.values.forEach(value =>{
        console.log(value);
      })
    });
  }

  stringify():string{
    let s = {
      'table_id':this.id,
      'removed_labels':this.removedLabels,
      'class_label':this.classLabel
    };
    return JSON.stringify(s);
  }
}
interface column {
  label: string;
  values: string[];
}
