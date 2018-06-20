import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { Platform, Nav, Config, NavController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PostsPage } from '../pages/posts/posts';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { AccountPage } from '../pages/account/account';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { ChatPage } from '../pages/chat/chat';
import { ItemCreatePage} from '../pages/item-create/item-create';

import { Settings } from '../providers/providers';
import { AppVariables} from '../pages/app-variables';
import { Items } from '../providers/providers';
import { Item } from '../models/item';



@Component({
  selector: 'page-app-component',
  template:`<ion-menu [content]="content">

    <ion-content>

      <ion-item color="primary" class = "main-menu" style="text-align: center">
        <div style="height:10vh; background-color: #488aff; display: inline-block; border-radius:50%; overflow: hidden; border-style: solid; border-color: white; border-width: 0.2em">
        <img src="{{this.profileImagePath}}" style="height:100%">
        </div>
        <p>Imran Sharif Rizvi</p>
      </ion-item>
      
      <ion-list style="overflow: hidden">
      
        <ion-item>
          <ion-icon color = "primary" name="baseball" item-start></ion-icon>
            Circle
            <p>Sabanci University</p>
        </ion-item>

        <ion-item *ngIf = "!this.loggedIn" menuClose (click)="openPage(LoginPage, false)">
          <ion-icon color = "primary" name="key" item-start></ion-icon>
          Login
        </ion-item>

        <div (click)="animateList()">    
          <ion-item>
            <ion-icon color = "primary" name="podium" item-start></ion-icon>
              Sorting Options
          </ion-item>
        </div>

        <div id="sorting-order-list" style="opacity: 0; max-height: 0vh; transition: 1.5s">
        <ion-item>
            <ion-icon color = "primary" name="podium" item-start style="visibility: hidden"></ion-icon>
            <ion-list style="margin-bottom: 0">
              <ion-item menuClose (click)="masterSortingListHandler('hot')">Hot</ion-item>
              <ion-item menuClose (click)="masterSortingListHandler('best')">Best</ion-item>
              <ion-item menuClose (click)="masterSortingListHandler('controversial')">Controversial</ion-item>
              <ion-item menuClose (click)="masterSortingListHandler('new')">New</ion-item>
            </ion-list>
        </ion-item>
        </div>

        <ion-item menuClose (click)="openPage(ChatPage, true, 0)">
          <ion-icon color = "primary" name="mail" item-start></ion-icon>
          Messages
        </ion-item>

        <ion-item menuClose (click)="openPage(AccountPage, true, 2)">
          <ion-icon color = "primary" name="apps" item-start></ion-icon>
          Account
        </ion-item>

      </ion-list>
      
      <!--<ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>-->
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage" main name="app"></ion-nav>`
})
export class MyApp {
  //rootPage = AppVariables.firstRunPage;
  rootPage: any;
  ChatPage = ChatPage;
  ItemCreatePage = ItemCreatePage;
  AccountPage = AccountPage;
  TabsPage = TabsPage;
  LoginPage = LoginPage;

  profileImagePath: String = "../assets/img/batman_blue.png";
  loggedIn: boolean;
  subscription: any;

  @ViewChild(Nav) nav: Nav;

  constructor(public items: Items, private translate: TranslateService, private platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen, public menu: MenuController, private ref:ChangeDetectorRef, private appVariables: AppVariables, private storage: Storage) {
    this.initTranslate();
    this.loggedIn = AppVariables.status.loggedIn;
    this.profileImagePath = appVariables.returnProfileImagePath();
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
        this.storage.get('loggedIn')
          .then((val) => 
          {
            if (val)
            {
              this.rootPage = TabsPage;
              console.log("the user has seen the tutorial and is logged in this is the value of loggedIn in local storage: " + val)
              this.loggedIn = val;
            }
            else
            {
              this.rootPage = WelcomePage;
              console.log("the user has seen the tutorial and is not logged in this is the value of loggedIn in local storage: " + val)
              this.loggedIn = val;
            }
          });
        } else {
          this.rootPage = TutorialPage;
        }
      });

    this.subscription = AppVariables.statusSubject.subscribe((value) => 
    { 
      this.loggedIn = value.loggedIn;
      console.log("value of this.loggedIn in app.component.ts has been changed to" + JSON.stringify(AppVariables.status)) 
    }); 
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      //the platform is ready plugins are available.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log()
      this.loggedIn = AppVariables.status.loggedIn;
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    /*if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });*/
  }

  openPage(page, tab?: boolean, tabIndex?: number) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (tab)
    this.nav.getActiveChildNav().select(tabIndex);
    else
    this.nav.push(page);
  }

  animateList() {
    var element: HTMLDivElement = <HTMLDivElement> document.getElementById("sorting-order-list");
    switch (element.style.maxHeight)
    {
      case "0vh":{
        element.style.maxHeight = "100vh";
        element.style.opacity = "1";
        break;
      }
      case "100vh":{
        element.style.maxHeight = "0vh";
        element.style.opacity = "0";
      }
    }
  }

  masterSortingListHandler(type: string){
    this.animateList();
    var postsRequest = this.items.query(type);
    postsRequest
    .map(res => res.json())
    .subscribe(res => {
      // If the API returned a successful response, parse the response
      if (!res.Error) {
        console.log("Success:query():app.component.ts\n" + JSON.stringify(res.Message)); //remove res.Message because it will be too long and will clutter the console
        let posts = res.Message;
        PostsPage.currentItems = [];  //reset the posts/items array every time a new response is fetched
        for (let item of posts) {
           PostsPage.currentItems.push(new Item({postId: item.post_id, title: item.title, url: item.url, upvotes: item.upvotes, downvotes: item.downvotes, submitter: item.user_id, submitted: item.submitted, type: item.type, comments: item.comments, commentChain: [], anonymous: item.anonymous, body: item.body}));
        }
      } 
      else 
      {
        console.log("Failure:query():appcomponent.ts\n" + JSON.stringify(res.Message));
      }
    }, err => {
      console.log('Failure:query():err received:appcomponent.ts:', JSON.stringify(err));
    });
  }

}
