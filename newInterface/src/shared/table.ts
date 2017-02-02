export class Table {
  public id: string;
  public columns: Array<column> = [];
  public classLabel: string = null;
  public name:string;

  constructor(id: string, name:string) {
    this.id = id;
    this.name= name;
  }

  addTableColumn(label: string, values: string[]): void {
    this.columns.push({label: label, values: values});
  }
  stringify():string{
    let s = {
      'table_id':this.id,
      'class_label':this.classLabel
    };
    return JSON.stringify(s);
  }
}

interface column {
  label: string;
  values: string[];
}
