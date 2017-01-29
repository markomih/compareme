import {Injectable} from '@angular/core';
import {Table} from './table';
import {Http, Headers} from "@angular/http";

@Injectable()
export class TableService {
  public table: Table;
  public validClassifiers: string[] = ['svm', 'knn'];
  private url: string = 'http://localhost:5000/classifier';

  constructor(private http: Http) {
    // this.table = new Table();
  }

  save(table: Table): void {
    this.table = table;
    this.table.print();
  }

  removeLabels(labels: string[]) {
    for (let index in labels) {
      this.table.removedLabels.push(labels[index]);
    }
  }

  setLabels(labels: string[]) {
    for (let i in labels) {
      remove(this.table.removedLabels, labels[i]);
    }
  }

  setClass(label: string) {
    remove(this.table.removedLabels, label);
    this.table.classLabel = label;
  }

  getClass(label: string): string {
    if (label == this.table.classLabel)
      return 'green';
    if (this.table.removedLabels.indexOf(label) > -1)
      return 'red';
    return 'blue';
  }

  isValidClassifier(classifier: string) {
    return this.validClassifiers.indexOf(classifier) > -1 && this.table.classLabel !== "";
  }

  apply(parameter: string): Promise<any> {
    let url = this.url.concat("/apply/", parameter);
    let data = this.table.stringify();
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(url, data, {headers: headers})
      .toPromise()
      .then((res) => {
        let data = res.json();
        return data;
      }).catch(TableService.handleError);
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}

function remove(arr, item) {
  for (let i = arr.length; i--;) {
    if (arr[i] === item) {
      arr.splice(i, 1);
    }
  }
}
