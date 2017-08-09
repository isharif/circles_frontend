import { Component} from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';

import { Items } from '../../providers/providers';
import { Item } from '../../models/item';
import { Api } from '../../providers/providers';
import { AppVariables } from '../app-variables'

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

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  comments: comment[] = [];
  topLevelCommentBox: boolean;

  constructor(public navCtrl: NavController, navParams: NavParams, public items: Items, public modalCtrl: ModalController, private api: Api) {
    this.item = navParams.get('item') || items.defaultItem;
    //this.comments = this.items.getComments();
    //console.log("this is the comment chain for this post" + JSON.stringify(this.item.commentChain)); reposition this line

    let comments = [];
    let commentsRequest = this.api.get('get_comments', { post_id: this.item.postId }).share();

    commentsRequest
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, parse the response
        var firstLevelParser: comment[] = [];
        if (!res.Error) {
          comments = res.Message;
          console.log("Success:constructor():item-create.ts\n" + JSON.stringify(comments)); //remove res.Message because it will be too long and will clutter the console
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
                    firstLevelParser[firstLevelParser.length -1].children[y].hasChild = true;
                  }
                }
              }
            } 
          }
          this.comments = firstLevelParser;
          console.log("item-create.ts: this is the commentchain for this post: " + JSON.stringify(this.comments));
          this.item.commentChain = this.comments;
        }
        else 
        {
          console.log("Failure:constructor():item-create.ts\n" + JSON.stringify(res.Message));
        }
      }, err => {
        console.log('Failue:constructor():err received:item-create.ts:', JSON.stringify(err));
      });
  }

  pop(){
    this.navCtrl.pop(ItemDetailPage)
  } 

  onCommentClick(id: number, textElementId: string, index1?: number, index2?: number, index3?: number){

    console.log("parameters passed: " + id + textElementId + index1 + index2 + index3);
    var element = <HTMLTextAreaElement> document.getElementById(textElementId) || { value: ""};
    var value = element.value;

    if (value != "")
    {
      console.log("comment addition to local data model initiated");
      
      let seq = this.api.post('comment_sent', {submitter: AppVariables.accountInfo.userId, anonymous: AppVariables.status.anonymous, body: value, post_id: this.item.postId, parent_id: id}).share();
      seq
        .map(res => res.json())
        .subscribe(res => {
          // If the API returned a successful response, mark the user as logged in
          if (!res.Error) {
            console.log("Success:onCommentClick():item-create.ts\n" + JSON.stringify(res.Message));
            if (index1 != undefined && index2 != undefined && index3 != undefined)
            {
              console.log("3rd level sub-comment addition attempted");
              this.item.commentChain[index1].children[index2].children.push({
                "commentId": res.Message[0]["LAST_INSERT_ID()"],
                "parent": id,
                "body": value,
                "hasChild": false,
                "box": false,
                "children":[]
              });
              this.item.commentChain[index1].children[index2].hasChild = true;
              console.log("this is the comment added in local array" + "commentId"+  res["LAST_INSERT_ID()"] + "parent" + id);
            }

            if (index1 != undefined && index2 != undefined && index3 == undefined)
            {
              console.log("2nd level sub-comment addition attempted");
              this.item.commentChain[index1].children[index2].children.push({
                "commentId": res.Message[0]["LAST_INSERT_ID()"],
                "parent": id,
                "body": value,
                "hasChild": false,
                "box": false,
                "children":[]
              });
              this.item.commentChain[index1].children[index2].hasChild = true;
              console.log("this is the comment added in local array" + "commentId"+  res["LAST_INSERT_ID()"] + "parent" + id);
            }
            
            if (index1 != undefined && index2 == undefined && index3 == undefined)
            {
              console.log("1st level sub-comment addition attempted");
              this.item.commentChain[index1].children.push({
                "commentId": res.Message[0]["LAST_INSERT_ID()"],
                "parent": id,
                "body": value,
                "hasChild": false,
                "box": false,
                "children":[]
              });
              this.item.commentChain[index1].hasChild = true;
              console.log("this is the comment added in local array" + "commentId"+  res["LAST_INSERT_ID()"] + "parent" + id);
            }

            if (index1 == undefined && index2 == undefined && index3 == undefined)
            {
              console.log("top level comment addition attempted");
              this.item.commentChain.push({
                "commentId": res.Message[0]["LAST_INSERT_ID()"],
                "parent": id,
                "body": value,
                "hasChild": false,
                "box": false,
                "children":[]
              });
              console.log("this is the comment added in local array" + "commentId"+  res["LAST_INSERT_ID()"] + "parent" + id);
            }
          }
          else 
          {
            console.log("Failure:onCommentClick():item-create.ts\n" + JSON.stringify(res.Message));
          }
        }, err => {
          console.log('Failue:onCommentClick():item-create.ts:err-received', JSON.stringify(err));
        });
    }
    if (index1 != undefined && index2 != undefined && index3 != undefined)
    this.item.commentChain[index1].children[index2].children[index3].box = !this.item.commentChain[index1].children[index2].children[index3].box;
    if (index1 != undefined && index2 != undefined && index3 == undefined)
    this.item.commentChain[index1].children[index2].box = !this.item.commentChain[index1].children[index2].box;
    if (index1 != undefined && index2 == undefined && index3 == undefined)
    this.item.commentChain[index1].box = !this.item.commentChain[index1].box; 
    if (index1 == undefined && index2 == undefined && index3 == undefined)
    this.topLevelCommentBox = !this.topLevelCommentBox;
  }

}
