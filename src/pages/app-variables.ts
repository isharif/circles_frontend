import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subject }    from 'rxjs/Subject';

import { TutorialPage } from './tutorial/tutorial';
import { TabsPage } from './tabs/tabs';

interface Status {
    loggedIn?: boolean,
    anonymous?: boolean,
}

interface AccountInfo {
    userId?: number,
    profileImagePath?: string,
    name?: string
}

@Injectable()
export class AppVariables {

    public static status: Status = {loggedIn: false, anonymous: false}
    public static accountInfo: AccountInfo = {userId: null, name: "Imran Sharif Rizvi"}
    public static userImageSet = false;


    public static statusSubject: Subject<Status> = new Subject<Status>();
    public static accountInfoSubject: Subject<AccountInfo> = new Subject<AccountInfo>();

    private _accountInfoSubscription: any;
    private _statusSubscription: any;

    constructor(private storage: Storage) {  

        storage.get('loggedIn')
          .then((val) => 
          {
            if (val)
            {
                console.log("value of status.loggedIn in app-variables.ts has bee updated to: " + val)
                AppVariables.status.loggedIn = val;
                storage.get('userId').then((value) => { AppVariables.accountInfo.userId = value });
                AppVariables.accountInfo.profileImagePath = "46.101.242.198:3000/profile-images/" + AppVariables.accountInfo.userId + ".jpg";
            }
            else
            {
                console.log("value of status.loggedIn in app-variables.ts has bee updated to: " + val)
                AppVariables.status.loggedIn = val;
              }
          });

        this._statusSubscription = AppVariables.statusSubject.subscribe((value) => 
            {   
                AppVariables.status.loggedIn = value.loggedIn;
                AppVariables.status.anonymous = value.anonymous;
                console.log("value of status changed"+ JSON.stringify(AppVariables.status))
            }); 

        this._accountInfoSubscription = AppVariables.accountInfoSubject.subscribe((value) => 
            { 
                AppVariables.accountInfo.profileImagePath = value.profileImagePath || AppVariables.accountInfo.profileImagePath;
                AppVariables.accountInfo.userId = value.userId || AppVariables.accountInfo.userId;
                AppVariables.accountInfo.name = value.name || AppVariables.accountInfo.name;
            });         
        this.storage.set("hasSeenTutorial", true);
    }

    returnFabImagePath()
    {
        if (AppVariables.status.anonymous)
        {
            return "assets/img/batman_white.png";
        }
        else
        {
            return "assets/img/user.png";
        }
    }

    returnProfileImagePath()
    {
        if (!AppVariables.status.loggedIn){
            return "assets/img/batman_white.png";
        }
        else
        {
            if(AppVariables.status.anonymous || !AppVariables.userImageSet)
            {
                return "assets/img/batman_white.png";
            }
            else
            {
                return AppVariables.accountInfo.profileImagePath;
            }
        }
    }

    
}