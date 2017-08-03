import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../../pages/pages';

import { User } from '../../providers/user';
import { AppVariables } from '../app-variables'

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.user.login(this.account)
    .map(res => res.json())
    .subscribe((resp) => {
      if (!resp.Error)
      {
        console.log("Success:doLogin():login.ts\n" + JSON.stringify(resp.Message));
        this.navCtrl.push(MainPage);
      }
      else 
      {
        console.log("Failue:doLogin():login.ts\n" + JSON.stringify(resp.Message));
        this.navCtrl.push(MainPage);
        let toast = this.toastCtrl.create({
          message: "You could not be logged in. Please try again with correct credentials",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    }, (err) => 
    {
      console.log("Failure:doLogin():err received:login.ts\n" + JSON.stringify(err));
      this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: "You could not be logged in. Please try again with correct credentials",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
