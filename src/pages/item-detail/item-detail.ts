import { Component} from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';

import { Items } from '../../providers/providers';
import { Item } from '../../models/item';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  comments: any;
  topLevelCommentBox: boolean;

  constructor(public navCtrl: NavController, navParams: NavParams, public items: Items, public modalCtrl: ModalController) {
    this.item = navParams.get('item') || items.defaultItem;
    this.comments = this.items.getComments();
    //console.log(JSON.stringify({ data: this.comments}, null, 4));
  }

  pop(){
    this.navCtrl.pop(ItemDetailPage)
  } 

  onCommentClick(id: number, textElementId: string, index1?: number, index2?: number, index3?: number){

    /*console.log(id);
    console.log(index1);
    console.log(index2);
    console.log(index3);*/
  
    if (index1 != undefined && index2 != undefined && index3 != undefined && this.item.commentChain[index1].children[index2].children[index3].box)
    {
      var element: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById(textElementId);
      var value = element.value;
      if (value != "")
      {
        this.item.commentChain[index1].children[index2].children.push({
          "commentID": 9999,
          "parent": id,
          "body": value,
          "hasChild": false,
          "box": false,
          "children":[]
        });
        this.item.commentChain[index1].children[index2].hasChild = true;
      }
    }

    if (index1 != undefined && index2 != undefined && index3 == undefined  && this.item.commentChain[index1].children[index2].box)
    {
      var element: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById(textElementId);
      var value = element.value;
      if (value != "")
      {
        this.item.commentChain[index1].children[index2].children.push({
          "commentID": 9999,
          "parent": id,
          "body": value,
          "hasChild": false,
          "box": false,
          "children":[]
        });
        this.item.commentChain[index1].children[index2].hasChild = true;
      }
    }
    
    if (index1 != undefined && index2 == undefined && index3 == undefined && this.item.commentChain[index1].box)
    {
      var element: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById(textElementId);
      var value = element.value;
      if (value != "")
      {
        this.item.commentChain[index1].children.push({
          "commentID": 9999,
          "parent": id,
          "body": value,
          "hasChild": false,
          "box": false,
          "children":[]
        });
        this.item.commentChain[index1].hasChild = true;
      }
    }

    if (index1 == undefined && index2 == undefined && index3 == undefined && this.topLevelCommentBox)
    {
      var element: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById(textElementId);
      var value = element.value;
      if (value != "")
      {
        console.log("top level comment addition attempted");
        this.item.commentChain.push({
          "commentID": 9999,
          "parent": id,
          "body": value,
          "hasChild": false,
          "box": false,
          "children":[]
        });
      }
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
