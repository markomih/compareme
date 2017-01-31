import {Injectable} from '@angular/core';
import {Table} from './table';
import {Http, Headers} from "@angular/http";
import {UserService} from "./user.service";

@Injectable()
export class TableService {
  public table: Table;
  public validClassifiers: string[] = ['svm', 'knn', 'lda', 'qda'];
  private url_select: string = 'http://localhost:5000/select_table';
  private url: string = 'http://localhost:5000/classifier';
  public url_upload: string = 'http://localhost:5000/upload';

  constructor(private http: Http) {
  }

  removeLabels(labels: string[]) {
    for (let index in labels) {
      this.table.removedLabels.push(labels[index]);
    }
  }

  deleteRemovedLabels() {
    let indexes = [];
    for (let i in this.table.removedLabels) {
      for (let j  in this.table.columns) {
        if (this.table.columns[j].label == this.table.removedLabels[i]) {
          indexes.push(j);
        }
      }
    }
    this.table.removedLabels = [];
    for (let i in indexes) this.table.columns.splice(indexes[i], 1);
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
      return 'hide';
    return 'blue';
  }

  isValidClassifier(classifier: string) {
    return this.validClassifiers.indexOf(classifier) > -1 && this.table.classLabel !== "";
  }

  apply(parameter: string): Promise<any> {
    let url = this.url.concat("/apply/", parameter.toLowerCase());
    let dataJSON = this.table.stringify();
    let token: string = UserService.getToken();
    if (token == null) {
      alert('user token has expired');
    }
    else {
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': token
      });

      return this.http
        .post(url, dataJSON, {headers: headers})
        .toPromise()
        .then((res) => {
          let data = res.json();
          return data.data;
        }).catch(TableService.handleError);
    }
  }

  predict(json_data, classifierName: string): Promise<string>{
    let url = this.url.concat("/predict/", classifierName);
    let token: string = UserService.getToken();
    if (token == null) {
      alert('user token has expired');
    } else {
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': token
      });

      return this.http
        .post(url, JSON.stringify({'table_id': this.table.id, 'predict': json_data}), {headers: headers})
        .toPromise()
        .then((res) => {
          let data = res.json();
          return data.data;
        }).catch(TableService.handleError);
    }
  }

  selectTable(table_id): Promise<boolean> {
    let token: string = UserService.getToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.post(this.url_select, JSON.stringify({'table_id': table_id}), {headers: headers}).toPromise().then((res) => {
      let dataObject = res.json();
      if (dataObject.success) {
        this.saveTable(dataObject)
      } else {
        alert('select table parsing error');
      }
      return dataObject.success;
    }).catch(TableService.handleError);
  }

  saveTable(dataObject) {
    let dataColumns = JSON.parse(dataObject.data.columns);
    let table: Table = new Table(dataObject.data.table_id, dataObject.data.name);
    table.classifiers = dataObject.data.classifiers;

    for (let columnLabel in dataColumns) {
      let column = dataColumns[columnLabel];
      let columnValues: string[] = [];

      for (let keyI in column) {
        columnValues.push(column[keyI].toString());
      }
      table.addTableColumn(columnLabel, columnValues);
    }
    this.table = table;
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
