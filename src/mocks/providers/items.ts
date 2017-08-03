import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Item } from '../../models/item';

@Injectable()
export class Items {
  items: Item[] = [];
  circle: string;
  defaultItem: any = {
    "name": "Burt Bear",
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt is a Bear.",
  };
  comments: Item[] = [];

  constructor(public http: Http) {

    let comments = [
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



    for (let item of items) {
      this.items.push(new Item(item));
    }

    for (let comment of comments) {
      this.comments.push(new Item(comment));
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

  addComment(item: Item){
    this.comments.push(item);
  }

  deleteComment(item: Item){
    this.comments.splice(this.items.indexOf(item), 1)
  }


  
}
