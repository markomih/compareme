import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {User} from "./user";

// TODO: apply
// TODO: predict
// TODO: plot
// TODO: datasets

@Injectable()
export class UserService {
  private domain = 'http://localhost:5000';
  public user: User;

  constructor(private http: Http) {
  }

  register(user: User): Promise<[boolean, string]> {
    let url = this.domain + "/api/users/register";
    let data = JSON.stringify(user);
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(url, data, { headers: headers })
      .toPromise()
      .then( (res) => {
        let data = res.json();
        return [data.success, data.data];
      })
      .catch(UserService.handleError);
  }
  login(user: User): Promise<[boolean, string]> {
    let url = this.domain + "/api/users/login";
    let data = JSON.stringify(user);
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(url, data, { headers: headers })
      .toPromise()
      .then( (res) => {
        let data = res.json();
        return [data.success, data.data];
      })
      .catch(UserService.handleError);
  }

  logout(): Promise<boolean> {
    let url = this.domain + "/api/users/logout";
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(url, "", { headers: headers })
      .toPromise()
      .then( (res) => {
        let data = res.json();
        return data.success && data.data;
      })
      .catch(UserService.handleError);
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
