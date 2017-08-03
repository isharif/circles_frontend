import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { AppVariables } from '../pages/app-variables';

@Injectable()
export class User {
  _user: any;


  constructor(public http: Http, public api: Api) {
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('login', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (!res.Error) {
          console.log("Success:login():user.ts\n" + JSON.stringify(res.Message));
          this._loggedIn(res);
        }
        else 
        {
          console.log("Failure:login():user.ts\n" + JSON.stringify(res.Message));
        }
      }, err => {
        console.log('Failue:login():err received:user.ts', JSON.stringify(err));
      });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (!res.Error) {
          console.log("Success:signUp():user.ts\n" + JSON.stringify(res.Message));
          this._loggedIn(res);
        }
        else 
        {
          console.log("Failure:signUp():user.ts\n" + JSON.stringify(res.Message));
        }
      }, err => 
      {
        console.log('Failue:signUp():err received:user.ts', JSON.stringify(err));
      });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    //this._user = resp.user;
    AppVariables.statusSubject.next({loggedIn: true});
    AppVariables.accountInfoSubject.next({userId: resp.Message[0].user_id});
    console.log("successfully logged in:" + JSON.stringify(resp.Message));
    console.log("status: " + AppVariables.status.loggedIn.valueOf());
    console.log("userId: " + AppVariables.accountInfo.userId.valueOf());
  }
}
