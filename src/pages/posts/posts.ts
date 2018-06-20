import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Subject }    from 'rxjs/Subject';

import { ItemCreatePage } from '../item-create/item-create';
import { ItemDetailPage } from '../item-detail/item-detail';
import { MapPage } from '../map/map';

import { Items } from '../../providers/providers';
import { AppVariables } from '../app-variables';
import { Item } from '../../models/item';
import { Api } from '../../providers/providers';


@Component({
  selector: 'page-posts',
  templateUrl: 'posts.html'
})
export class PostsPage {
  public static currentItems: Item[];
  fabImagePath: String;
  posts: Item[] = [];
  public sortingOption: Subject<any> = new Subject<any>();

  constructor(public navCtrl: NavController, public items: Items, public appVariables: AppVariables, public modalCtrl: ModalController, private alertCtrl: AlertController, public api: Api, private storage: Storage) {
    this.fabImagePath = appVariables.returnFabImagePath();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    var postsRequest = this.items.query("hot");
    postsRequest
    .map(res => res.json())
    .subscribe(res => {
      // If the API returned a successful response, parse the response
      if (!res.Error) {
        console.log("Success:query():posts.ts\n" + JSON.stringify(res.Message)); //remove res.Message because it will be too long and will clutter the console
        let posts = res.Message;
        PostsPage.currentItems = [];  //reset the posts/items array every time a new response is fetched
        for (let item of posts) {
           PostsPage.currentItems.push(new Item({postId: item.post_id, title: item.title, url: item.url, upvotes: item.upvotes, downvotes: item.downvotes, submitter: item.user_id, submitted: item.submitted, type: item.type, comments: item.comments, commentChain: [], anonymous: item.anonymous, body: item.body}));
        }
      } 
      else 
      {
        console.log("Failure:query():posts.ts\n" + JSON.stringify(res.Message));
      }
    }, err => {
      console.log('Failure:query():err received:posts.ts:', JSON.stringify(err));
    });
    console.log("this shit is the current items in posts.ts" + "\n" + PostsPage.currentItems)
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    if (AppVariables.status.loggedIn)
    {
      let addModal = this.modalCtrl.create(ItemCreatePage);
      addModal.onDidDismiss(item => {
        if (item) {
  
          let seq = this.api.post('post_sent', {user_id: AppVariables.accountInfo.userId, type: item.type, anonymous: AppVariables.status.anonymous, title: item.title, body: item.body, data: item.url}).share();
          seq
            .map(res => res.json())
            .subscribe(res => {
              // If the API returned a successful response, mark the user as logged in
              if (!res.Error) {
                console.log("Success:addItem():posts.ts\n" + JSON.stringify(res.Message));
              }
              else 
              {
                console.log("Failure:addItem():posts.ts\n" + JSON.stringify(res.Message));
              }
            }, err => {
              console.log('Failue:addItem():posts.ts:err-received', JSON.stringify(err));
            });
          
          item.url = 'data:image/jpg;base64,' + item.url;
          this.items.add(item);  
          console.log("post_type is:" + item.type)
        } 
      })
      addModal.present();
    }
    else
    {
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'You need to login before you can add Posts!',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }

  get currentItems() {
    return PostsPage.currentItems;
  }


  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }

  swipeEvent(e) {
    if (e.direction == 2) {
      this.navCtrl.parent.parent.push(MapPage);
    }
  }

  toggleAnonymity() {
    let value: boolean = AppVariables.status.anonymous;
    AppVariables.statusSubject.next({anonymous: !value});
    this.fabImagePath = this.appVariables.returnFabImagePath();
    //console.log(this.fabImagePath); 
    //console.log("toggle button presssed");
  }

}
