import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ItemDetailPage } from '../../pages/item-detail/item-detail';

import { Settings } from '../../providers/settings';
import { AppVariables } from '../../pages/app-variables';
import { Items } from '../../providers/providers';
import { Item } from '../../models/item';
import { Api } from '../../providers/providers';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})

export class AccountPage {
  // Our local settings object
  options: any;
  settingsReady = false;
  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;
  profileImagePath: String = "../assets/img/batman_blue.png";
  userPosts: any = [];
  userComments: any = [];
  AppVariables = AppVariables;
  
  accountSegment: String = "posts";


  subSettings: any = AccountPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public appVariables: AppVariables, 
    public items: Items,
    public api: Api
    )

    {
      let postsRequest = this.api.get('get_user_posts', {user_id: AppVariables.accountInfo.userId}).share();
      
      postsRequest
        .map(res => res.json())
        .subscribe(res => {
          // If the API returned a successful response, parse the response
          if (!res.Error) {
            this.userPosts = res.Message;
            console.log("Success:constructor():account-page.ts\n" + JSON.stringify(this.userPosts)); //remove res.Message because it will be too long and will clutter the console
          }
          else 
          {
            console.log("Failure:constructor():account-page.ts\n" + JSON.stringify(res.Message));
          }
        }, err => {
          console.log('Failure:constructor():err received:account-page.ts:', JSON.stringify(err));
        });
      
      this.profileImagePath = appVariables.returnProfileImagePath();
      //console.log("this is the items array in my account.ts: " + JSON.stringify(this.userPosts));
      this.userPosts = this.userPosts.filter(item => item.submitter == AppVariables.accountInfo.userId);
      console.log("this is the items array in my account.ts: " + JSON.stringify(this.userPosts));
      console.log("the current userId in account.ts is: " + AppVariables.accountInfo.userId);

      let comments = [];
      let commentsRequest = this.api.get('get_comments_user_id', { submitter: AppVariables.accountInfo.userId }).share();

      commentsRequest
        .map(res => res.json())
        .subscribe(res => {
          // If the API returned a successful response, parse the response
          if (!res.Error) {
            this.userComments = res.Message;
            console.log("Success:constructor():commentsRequest:account.ts\n" + JSON.stringify(res.Message)); //remove res.Message because it will be too long and will clutter the console
            }
          else 
          {
            console.log("Failure:constructor():commentsRequest:account.ts\n" + JSON.stringify(res.Message));
          }
        }, err => {
          console.log('Failure:constructor():err received:commentsRequest:account.ts\n' + JSON.stringify(err));
        });
  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3]
    };

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    //this.form = this.formBuilder.group({});

  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }

  openItem(item: Item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }

  formatDate(dateParameter) {
  var date = new Date(dateParameter);
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}
}
