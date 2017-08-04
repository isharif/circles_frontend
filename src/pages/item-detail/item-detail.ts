import { Component} from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';

import { Items } from '../../providers/providers';
import { Item } from '../../models/item';
import { Api } from '../../providers/providers';
import { AppVariables } from '../app-variables'

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  comments: any;
  topLevelCommentBox: boolean;

  constructor(public navCtrl: NavController, navParams: NavParams, public items: Items, public modalCtrl: ModalController, private api: Api) {
    this.item = navParams.get('item') || items.defaultItem;
    this.comments = this.items.getComments();
    console.log("this is the comment chain for this post" + JSON.stringify(this.item.commentChain));
    //console.log(JSON.stringify({ data: this.comments}, null, 4));
  }

  pop(){
    this.navCtrl.pop(ItemDetailPage)
  } 

  onCommentClick(id: number, textElementId: string, index1?: number, index2?: number, index3?: number){

    /*console.log(id);     //checking all the input values
    console.log(index1);
    console.log(index2);
    console.log(index3);*/
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
            if (index1 != undefined && index2 != undefined && index3 != undefined && this.item.commentChain[index1].children[index2].children[index3].box)
            {
              this.item.commentChain[index1].children[index2].children.push({
                "commentId": res.Message.commentId,
                "parent": id,
                "body": value,
                "hasChild": false,
                "box": false,
                "children":[]
              });
              this.item.commentChain[index1].children[index2].hasChild = true;
            }

            if (index1 != undefined && index2 != undefined && index3 == undefined  && this.item.commentChain[index1].children[index2].box)
            {
              this.item.commentChain[index1].children[index2].children.push({
                "commentId": res.Message.commentId,
                "parent": id,
                "body": value,
                "hasChild": false,
                "box": false,
                "children":[]
              });
              this.item.commentChain[index1].children[index2].hasChild = true;
            }
            
            if (index1 != undefined && index2 == undefined && index3 == undefined && this.item.commentChain[index1].box)
            {
              this.item.commentChain[index1].children.push({
                "commentId": res.Message.commentId,
                "parent": id,
                "body": value,
                "hasChild": false,
                "box": false,
                "children":[]
              });
              this.item.commentChain[index1].hasChild = true;
            }

            if (index1 == undefined && index2 == undefined && index3 == undefined && this.topLevelCommentBox)
            {
              console.log("top level comment addition attempted");
              this.item.commentChain.push({
                "commentId": res.Message.commentId,
                "parent": id,
                "body": value,
                "hasChild": false,
                "box": false,
                "children":[]
              });
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
