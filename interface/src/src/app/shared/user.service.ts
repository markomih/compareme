import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {User} from "./user";

// TODO: add third field in the form
// TODO: add tag required
// TODO: test register
// TODO: test login
// TODO: test logout
// TODO: print name somewhere


@Injectable()
export class UserService {
  private domain = 'http://localhost:5000';
  public user: User;

  constructor(private http: Http) {
  }

  register(user: User): Promise<boolean> {
    let url = this.domain + "/api/users/register";
    let data = JSON.stringify(user);
    return this.post(url, data).then( (res) => {
      if (JSON.parse(res).data){
        this.user = user;
        return true
      } else {
        return false;
      }
    });
  }

  private post(url: string, data: string): Promise<string> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(url, data, { headers: headers })
      .toPromise()
      .then(res => res.json().data)
      .catch(UserService.handleError);
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
