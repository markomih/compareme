import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {User} from "./user";
import {Table} from "./table";

// TODO: plot

@Injectable()
export class UserService {
  private domain = 'http://localhost:5000';
  public user: User;

  constructor(private http: Http) {
    this.user = new User();
    if (localStorage.getItem('user') != null){
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }
  saveUserLocally(){
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  removeUserDataLocally(){
    this.user = new User();
    localStorage.removeItem('user');
  }
  isLogged():Promise<boolean>{
    let url = this.domain.concat('/api/users/is_valid');
    if (this.user.token){

    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.user.token
    });

    return this.http
      .post(url, "", {headers: headers})
      .toPromise()
      .then((res) => {
        let data = res.json();
        if (!data.data){
          this.removeUserDataLocally();
        }
        return data.success && data.data;
      })
      .catch(UserService.handleError);
    }
  }
  register(user: User): Promise<boolean> {
    let url = this.domain + "/api/users/register";
    let data = JSON.stringify(user);
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, data, {headers: headers})
      .toPromise().then((res) => {
        let data = res.json();
        if (data.success) {
          this.user.token = data.data.token;
          return true;
        } else if (data.data ==401){
          this.removeUserDataLocally();
        }
        return data.success;
      }).catch(UserService.handleError);
  }

  login(user: User): Promise<boolean> {
    let url = this.domain + "/api/users/login";
    let data = JSON.stringify(user);
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, data, {headers: headers})
      .toPromise().then((res) => {
        let data = res.json();
        if (data.success) {
          this.user.token = data.data.token;
          return true;
        } else if (data.data == 401){
          this.removeUserDataLocally();
        }
        return data.success;
      }).catch(UserService.handleError);
  }

  logout(){
    let url = this.domain + "/api/users/logout";
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.user.token
    });

    this.removeUserDataLocally();
    this.user = new User();
    this.http.post(url, "", {headers: headers}).toPromise().then()
      .catch(UserService.handleError);
  }
  static getToken():string{
    let token: string = null;
    if (localStorage.getItem('user') != null) {
      let user: User = new User();
      user = JSON.parse(localStorage.getItem('user'));
      token = user.token;
    }
    return token;
  }
  updateUserView(){
    this.getTables().then(r=>this.saveUserLocally());
  }
  getTables(): Promise<boolean> {
    if (this.user.token){
      let url = this.domain + "/tables";
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.user.token
      });
      return this.http.post(url, "", {headers:headers}).toPromise().then((res)=>{
        let data = res.json();
        let tables = [];
        if (data.success) {
          for (let i in data.data) {
            let table: Table = new Table(data.data[i].table_id, data.data[i].name);
            tables.push(table);
          }
          this.user.tables = tables;
        } else if (data.data == 401) {
          this.removeUserDataLocally();
        }
        return data.success;
      }).catch(UserService.handleError);
    }
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
