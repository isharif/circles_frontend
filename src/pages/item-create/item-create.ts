import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ViewController, ToastController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

import { AppVariables } from '../app-variables'
import { Api } from '../../providers/providers'
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  item: any;
  form: FormGroup;
  postTypePicture: boolean = true;
  type: string = "picture_post";
  anonymous: boolean;
  post: { user_id: string  }

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera, public toastCtrl: ToastController, public api: Api) {
    this.form = formBuilder.group({
      url: [''],
      title: ['', Validators.required],
      body: [''],
      type: ['picture_post']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

  changePostType()
  {
    this.postTypePicture = !this.postTypePicture;
    if(this.postTypePicture)
    {
      this.type = "picture_post";
      this.form.patchValue({'type': "picture_post"});
    }
    else
    {
      this.type = "text_post";
      this.form.patchValue({'type': "text_post"});
    }
  }

  getPicture() {
    if (AppVariables.status.loggedIn) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 480,
        targetHeight: 800
      }).then((data) => {
        this.form.patchValue({'url': data}); //take out the meta data from image
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      let pos = imageData.indexOf(",");
      imageData = imageData.slice(pos+1);
      this.form.patchValue({ 'url': imageData});
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return ('url(data:image/jpg;base64,' + this.form.controls['url'].value + ')');
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { 
      let toast = this.toastCtrl.create({
        message: "Some of the information given was invalid. Please try again.",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return; 
    }
    this.viewCtrl.dismiss(this.form.value);
  }
}
