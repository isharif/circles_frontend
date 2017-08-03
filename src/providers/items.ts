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
  index: number
}

@Injectable()
export class Items {
  items: any[] = [];
  posts: Item[] = [];
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
        let firstLevelParser: comment[];
        let secondLevelParder: comment[];
        let thirdlevelParser: comment[];
        if (!res.Error) {
          console.log("Success:constructor():items.ts\n" + JSON.stringify(res.Message)); //remove res.Message because it will be too long and will clutter the console
          comments = res.Message;
          for (let item of comments) {
              this.comments.push({commentId: item.comment_id, parentId: item.parent_id, postId: item.post_id, body: item.body, hasChild: false, box: false, children: [], index: item.index});
          }
          for (let i = 0; i < this.comments.length; i++)
          {
            if (this.comments[i].parentId == 0)
            {
              firstLevelParser.push(comments[i]);
              this.comments.slice(i,1)
              for (let x = 0; x < this.comments.length; x++)
              {
                if (this.comments[x].parentId == firstLevelParser[firstLevelParser.length-1].commentId)
                 { 
                   firstLevelParser[firstLevelParser.length-1].children.push(comments[x]);
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
          
        }
        else 
        {
          console.log("Failure:constructor():items.ts\n" + JSON.stringify(res.Message));
        }
      }, err => {
        console.log('Failue:constructor():err received:items.ts:', JSON.stringify(err));
      });
  
    let comments1 = [
      {
        "commentID": 1,
        "parent": 0,
        "body": "this is a first level comment",
        "hasChild": true,
        "box": false,
        "children":[
          {
            "commentID": 2,
            "parent": 1,
            "body":"this is a second level comment",
            "hasChild":true,
            "box": false,
            "children":[
              {
                "commentID": 3,
                "parent": 2,
                "body":"this is a third level comment and I am typing in the dark without looking at the keyboard. I definitely need to improve my blind typing speed and accuracy",
                "hasChild": false,
                "box": false,
                "children": []
              }
            ]
          },          
          {
            "commentID": 4,
            "parent": 1,
            "body":"this is a second level comment",
            "hasChild":true,
            "box": false,
            "children":[
              {
                "commentID": 5,
                "parent": 4,
                "body":"this is a third level comment",
                "hasChild": false,
                "box": false,
                "children": []
              }
            ]
          }
        ]
      },
      { 
        "commentID": 6,
        "parent": 0,
        "body":"this is a first level comment",
        "hasChild": true,
        "box": false,
        "children":[
          {
            "commentID": 7,
            "parent": 6,
            "body":"this is a second level comment",
            "hasChild":true,
            "box": false,
            "children":[
              { 
                "commentID": 8,
                "parent": 7,
                "body":"this is a third level comment",
                "hasChild": false,
                "box": false,
                "children": []
              }
            ]
          }
        ]
      }
    ];

    let items = [
      {
          "title":"Best sunset in the world",
          "url":"https://s-media-cache-ak0.pinimg.com/736x/53/27/13/5327132ccab16453388d1577708f5e94--sunset-art-ocean-sunset.jpg",
          "upvotes":28,
          "downvotes":15,
          "submitter":"cem ozmen",
          "submitted":"SabanciUniversity:NaturePorn",
          "type":"picture_post",
          "comments":"24",
          "commentChain": [
                          {
                            "commentID": 1,
                            "parent": 0,
                            "body": "this is a first level comment",
                            "hasChild": true,
                            "box": false,
                            "children":[
                              {
                                "commentID": 2,
                                "parent": 1,
                                "body":"this is a second level comment",
                                "hasChild":true,
                                "box": false,
                                "children":[
                                  {
                                    "commentID": 3,
                                    "parent": 2,
                                    "body":"this is a third level comment and I am typing in the dark without looking at the keyboard. I definitely need to improve my blind typing speed and accuracy",
                                    "hasChild": false,
                                    "box": false,
                                    "children": []
                                  }
                                ]
                              },          
                              {
                                "commentID": 4,
                                "parent": 1,
                                "body":"this is a second level comment",
                                "hasChild":true,
                                "box": false,
                                "children":[
                                  {
                                    "commentID": 5,
                                    "parent": 4,
                                    "body":"this is a third level comment",
                                    "hasChild": false,
                                    "box": false,
                                    "children": []
                                  }
                                ]
                              }
                            ]
                          },
                          { 
                            "commentID": 6,
                            "parent": 0,
                            "body":"this is a first level comment",
                            "hasChild": true,
                            "box": false,
                            "children":[
                              {
                                "commentID": 7,
                                "parent": 6,
                                "body":"this is a second level comment",
                                "hasChild":true,
                                "box": false,
                                "children":[
                                  { 
                                    "commentID": 8,
                                    "parent": 7,
                                    "body":"this is a third level comment",
                                    "hasChild": false,
                                    "box": false,
                                    "children": []
                                  }
                                ]
                              }
                            ]
                          }
                        ]
      },
      {
          "title":"The beauty",
          "url":"http://for91days.com/photos/Istanbul/Istanbul%20Cats/Istanbul%20Cats%2034%2020130707%20Istanbul%20Cat%20Blog%20for91days.com.jpg",
          "upvotes":14,
          "downvotes":2,
          "submitter":"ipek erdem",
          "submitted":"SabanciUniversity:AnimalLove",
          "type": "picture_post",
          "comments":"24",
          "commentChain": []
      },
      {
          "title":"They're here boys",
          "url":"http://img15.deviantart.net/8708/i/2017/107/6/4/xayah_and_rakan___league_of_legends_by_chubymi-db68gjv.jpg",
          "upvotes":14,
          "downvotes":2,
          "submitter":"ipek erdem",
          "submitted":"SabanciUniversity:AnimalLove",
          "type":"picture_post",
          "comments":"24",
          "commentChain": 
          [
            {
              "commentID": 1,
              "parent": 0,
              "body": "this is a first level comment",
              "hasChild": true,
              "box": false,
              "children":[
                {
                  "commentID": 2,
                  "parent": 1,
                  "body":"this is a second level comment",
                  "hasChild":true,
                  "box": false,
                  "children":[
                    {
                      "commentID": 3,
                      "parent": 2,
                      "body":"this is a third level comment and I am typing in the dark without looking at the keyboard. I definitely need to improve my blind typing speed and accuracy",
                      "hasChild": false,
                      "box": false,
                      "children": []
                    }
                  ]
                },          
                {
                  "commentID": 4,
                  "parent": 1,
                  "body":"this is a second level comment",
                  "hasChild":true,
                  "box": false,
                  "children":[
                    {
                      "commentID": 5,
                      "parent": 4,
                      "body":"this is a third level comment",
                      "hasChild": false,
                      "box": false,
                      "children": []
                    }
                  ]
                }
              ]
            },
            { 
              "commentID": 6,
              "parent": 0,
              "body":"this is a first level comment",
              "hasChild": true,
              "box": false,
              "children":[
                {
                  "commentID": 7,
                  "parent": 6,
                  "body":"this is a second level comment",
                  "hasChild":true,
                  "box": false,
                  "children":[
                    { 
                      "commentID": 8,
                      "parent": 7,
                      "body":"this is a third level comment",
                      "hasChild": false,
                      "box": false,
                      "children": []
                    }
                  ]
                }
              ]
            }
          ]
      },
      {
          "title":null,
          "url":"https://janeyinmersin.files.wordpress.com/2013/11/keep-calm-and-learn-turkish-21.png",
          "upvotes":14,
          "downvotes":2,
          "submitter":"ipek erdem",
          "submitted":"SabanciUniversity:AnimalLove",
          "type":"picture_post",
          "comments":"24",
          "commentChain": comments
      },
      {
          "body":"Anyone have a projector? Lets watch the game of thrones premiere outside one of the dorms",
          "upvotes":14,
          "downvotes":2,
          "submitter":"ipek erdem",
          "submitted":"SabanciUniversity:AnimalLove",
          "type":"text_post",
          "comments":"24",
          "commentChain": []
      },
      {
          "body":"Circles is the bomb",
          "upvotes":14,
          "downvotes":2,
          "submitter":"ipek erdem",
          "submitted":"SabanciUniversity:AnimalLove",
          "type":"text_post",
          "comments":"24",
          "commentChain": comments
      }

    ];

    for (let post of this.items) {
      for (let d = 0; d < this.comments.length; d++)
      {
        if (post.postId == this.comments[d].postId)
          post.commentChain.push(this.comments[d])
      }
    }
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
