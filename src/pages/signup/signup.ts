import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';
import { AppVariables } from '../app-variables';

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  account: { name: string, email: string, password: string } = {
    name: '',
    email: '',
    password: ''
  };

  //translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    // Attempt to login in through our User service
    this.user.signup(this.account)
    .map(res => res.json())
    .subscribe((resp) => 
    {
      if (!resp.Error)
      {
        console.log("Success:doSignUp():signup.ts\n" + JSON.stringify(resp.Message));
        this.navCtrl.push(MainPage);
      }
      else 
      {
        console.log("Failure:doSignUp():singup.ts\n" + JSON.stringify(resp.Message));
        this.navCtrl.push(MainPage);
        // Unable to sign up
        let toast = this.toastCtrl.create({
          message: "Unable to create account, Please check your credentials and try again.",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    }, (err) => 
    {
      console.log("Failure:doSignUp():err received:singup.ts\n" + JSON.stringify(err));
      this.navCtrl.push(MainPage);
      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: "Unable to create account, Please check your credentials and try again.",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
