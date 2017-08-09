import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Item } from '../models/item';

import { Api } from './api';

interface comment{
  commentId: number,
  parentId: number,
  postId: number,
  body: string,
  hasChild: boolean,
  box: boolean,
  children: comment[],
  //index: number add index value later
}

@Injectable()
export class Items {
  items: any[] = [];
  posts: Item[] = []; //switch from using items to this
  circle: string;
  defaultItem: any = {
    "name": "Burt Bear",
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt is a Bear.",
  };
  comments: comment[] = [];

  constructor(public http: Http, public api: Api) {
    let posts = [];
    let postsRequest = this.api.get('get_posts').share();
    
    postsRequest
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, parse the response
        if (!res.Error) {
          console.log("Success:constructor():items.ts\n" + JSON.stringify(res.Message)); //remove res.Message because it will be too long and will clutter the console
          posts = res.Message;
          for (let item of posts) {
             this.items.push(new Item({postId: item.post_id, title: item.title, url: item.url, upvotes: item.upvotes, downvotes: item.downvotes, submitter: item.user_id, submitted: item.submitted, type: item.type, comments: item.comments, commentChain: [], anonymous: item.anonymous, body: item.body}));
          }
        } 
        else 
        {
          console.log("Failure:constructor():items.ts\n" + JSON.stringify(res.Message));
        }
      }, err => {
        console.log('Failue:constructor():err received:items.ts:', JSON.stringify(err));
      });
  }

  query(params?: any) {
    if (!params) {
      return this.items;
    }

    return this.items.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  getComments(){
    return this.comments;
  }

  add(item: Item) {
    this.items.push(item);
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  addComment(comment: comment){
    this.comments.push(comment);
  }

  deleteComment(item: Item){
    this.comments.splice(this.items.indexOf(item), 1)
  }


  
}
