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
  comments: comment[] = [];
  http: Http;
  api: Api;
  defaultItem: any = {
    "name": "Burt Bear",
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt is a Bear.",
  };

  constructor(public api1: Api) {
    this.api = api1;
  }

  query(type?: string) {
    let posts = [];
    /* if (type==="hot")
    {
      var postsRequest = this.api.get('get_posts',{type:"hot"}).share();
    }
    else
    {
      var postsRequest = this.api.get('get_posts',{type:"hot"}).share();
    } */
    switch(type) { 
      case "hot": { 
        var postsRequest = this.api.get('get_posts',{type:"hot"}).share();
        break; 
      } 
      case "best": { 
        var postsRequest = this.api.get('get_posts',{type:"best"}).share();
        break; 
      } 
      case "controversial": { 
        var postsRequest = this.api.get('get_posts',{type:"controversial"}).share();
        break; 
      } 
      case "new": { 
        var postsRequest = this.api.get('get_posts',{type:"new"}).share();
        break; 
      } 
      default: { 
        var postsRequest = this.api.get('get_posts').share();
        break; 
      } 
   } 
   
    postsRequest
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, parse the response
        if (!res.Error) {
          console.log("Success:query():items.ts\n" + JSON.stringify(res.Message)); //remove res.Message because it will be too long and will clutter the console
          posts = res.Message;
          this.items = [];  //reset the posts/items array every time a new response is fetched
          for (let item of posts) {
             this.items.push(new Item({postId: item.post_id, title: item.title, url: item.url, upvotes: item.upvotes, downvotes: item.downvotes, submitter: item.user_id, submitted: item.submitted, type: item.type, comments: item.comments, commentChain: [], anonymous: item.anonymous, body: item.body}));
          }
        } 
        else 
        {
          console.log("Failure:query():items.ts\n" + JSON.stringify(res.Message));
        }
      }, err => {
        console.log('Failure:query():err received:items.ts:', JSON.stringify(err));
      });
    return postsRequest;
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
