import { UnAuthError } from "./../errors/unauth-error";
import { AppError } from "./../errors/app-error";
import { Router } from "@angular/router";
import { CommonApiService } from "./common.service";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ReplaySubject } from "rxjs/ReplaySubject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/distinctUntilChanged";
// import 'rxjs/add/operator/asObservable';
import { ApiService } from "./api.service";
import { JwtService } from "./jwt.service";
import { User } from "../models/user.model";

@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject
    .asObservable()
    .distinctUntilChanged();
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  constructor(
    private _api: ApiService,
    private _jwt: JwtService,
    private _http: Http,
    private loginService: CommonApiService,
    private route: Router
  ) {}

  /**
   * Verify jwt in local storage .If valid load user's info .
   * Else clear all token.
   */
  initializeUser() {
    // if (this._jwt.getToken()) {

    // Testing data
    // this.setAuth(user);

    // Use below code fetch and update user

    // this._api.get()
    //     .subscribe(data => {
    //         if (data.status) {
    //             this.setAuth(data.user);
    //         } else {
    //             this.clearAuth()
    //         }
    //     },
    //     err => this.clearAuth())
    // } else {
    // this.clearAuth();

    // }
    if (this._jwt.getToken()) {
      this.loginService.getData("get-user", {}).subscribe(
        res => {
          if (res.status) {
            this.setAuth(res.data);
          } else {
            this.clearAuth();
          }
        },
        (err: AppError) => {
          if (err instanceof UnAuthError) {
            this.loginService.getData("refresh", {}).subscribe(res => {
              this._jwt.saveToken(res.access_token, res.refresh_token);
            });
          } else {
            this.clearAuth();
          }
        }
      );
    } else {
      this.clearAuth();
    }
  }

  setAuth(user: User) {
    // Save the current token in ls
    // this._jwt.saveToken(user.token);
    // set current user info in observable
    this.currentUserSubject.next(user);
    // set isauth observable to true
    this.isAuthenticatedSubject.next(true);
  }

  clearAuth() {
    // Clear token
    this._jwt.purgeToken();
    // Initialize current user observable with empty object.
    this.currentUserSubject.next(new User());
    // set isauth to false
    this.isAuthenticatedSubject.next(false);
    //   }
    // });
    // window.location.href = "login";
  }

  updateCurrentUserSubject(user) {
    console.log("updating current user");
    this.currentUserSubject.next(user);
    console.log(this.currentUserSubject.value);
  }

  attemptAuth() {
    // TODO  perform the  validation and api call  here
  }

  getCurrentUser(): User {
    // Get current user object
    return this.currentUserSubject.value;
  }

  updateuserData(): Observable<User> {
    return this._api.update().map(data => {
      if (data.status) {
        this.currentUserSubject.next(data.user);
      }
      return data.user;
    });
  }
}
