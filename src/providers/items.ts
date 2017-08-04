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
    
    let comments = [];
    let parsedComments = [];
    let commentsRequest = this.api.get('get_comments').share();
    
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

    commentsRequest
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, parse the response
        var firstLevelParser: comment[] = [];
        if (!res.Error) {
          comments = res.Message;
          console.log("Success:constructor():items.ts\n" + JSON.stringify(comments)); //remove res.Message because it will be too long and will clutter the console
          for (let item of comments) {
              this.comments.push({commentId: item.comment_id, parentId: item.parent_id, postId: item.post_id, body: item.body, hasChild: false, box: false, children: []}); // add index value
          }
          for (let i = 0; i < this.comments.length; i++)
          {
            if (!this.comments[i].parentId) // will check to see whether parent id exists
            {
              firstLevelParser.push(this.comments[i]);
              this.comments.slice(i,1)
              for (let x = 0; x < this.comments.length; x++)
              {
                if (this.comments[x].parentId == firstLevelParser[firstLevelParser.length-1].commentId)
                 { 
                   firstLevelParser[firstLevelParser.length-1].children.push(this.comments[x]);
                   comments.slice(x,1);
                   firstLevelParser[firstLevelParser.length-1].hasChild = true;
                 }
              }
              for (let y = 0; y < firstLevelParser[firstLevelParser.length - 1].children.length; y++) 
              {
                for (let z = 0; z < this.comments.length; z++)
                {
                  if (this.comments[z].parentId == firstLevelParser[firstLevelParser.length -1].children[y].commentId)
                  {
                    firstLevelParser[firstLevelParser.length -1].children[y].children.push(this.comments[z]);
                    this.comments.slice(z,1)
                  }
                }
              }
            } 
          }
          this.comments = firstLevelParser;
          console.log("this is the commentchain at the end of the first level of comments" + JSON.stringify(this.comments));
          for (let post of this.items) {
            for (let d = 0; d < this.comments.length; d++)
            {
              if (post.postId == this.comments[d].postId)
                post.commentChain.push(this.comments[d])
            }
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
