import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

interface Status {
    loggedIn?: boolean,
    anonymous?: boolean,
}

interface AccountInfo {
    userId?: number,
    profileImagePath?: string
}

@Injectable()
export class AppVariables {

    public static status: Status = {loggedIn: false, anonymous: false}
    public static accountInfo: AccountInfo = {userId: 0, profileImagePath: ''}

    public static statusSubject: Subject<Status> = new Subject<Status>();
    public static accountInfoSubject: Subject<AccountInfo> = new Subject<AccountInfo>();

    private _accountInfoSubscription: any;
    private _statusSubscription: any;

    constructor() {  
    this._statusSubscription = AppVariables.statusSubject.subscribe((value) => 
        {   
            if (value.hasOwnProperty('loggedIn'))
            AppVariables.status.loggedIn = value.loggedIn
            if (value.hasOwnProperty('anonymous'))
            AppVariables.status.anonymous = value.anonymous
            console.log("value of status changed"+ JSON.stringify(AppVariables.status))
        }); 

    this._accountInfoSubscription = AppVariables.accountInfoSubject.subscribe((value) => 
        { 
            AppVariables.accountInfo.profileImagePath = value.profileImagePath || AppVariables.accountInfo.profileImagePath;
            AppVariables.accountInfo.userId = value.userId || AppVariables.accountInfo.userId;
        }); 
    }

    returnFabImagePath(){
        if (AppVariables.status.anonymous)
        {
            return "../../assets/img/batman_white.png";
        }
        else
        {
            return "../../assets/img/user.png";
        }
    }

    returnProfileImagePath(){
        if (AppVariables.status.loggedIn && !AppVariables.status.anonymous){
            //getimage from local storage from here
        }
        else
        {
            return "../assets/img/batman_blue.png";
        }
    }
    

}