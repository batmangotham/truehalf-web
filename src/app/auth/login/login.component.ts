import { AuthService, FacebookLoginProvider } from "angular4-social-login";
import { ResetDialogComponent } from "./../password-reset/reset-dialog/reset-dialog.component";
import { MatSnackBar, MatDialog } from "@angular/material";
import {
  AppError,
  UserService,
  CommonApiService,
  JwtService,
  UnAuthError
} from "../../shared";
import { FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "app/shared/services/firebase.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["login.component.scss"]
})
export class LoginComponent implements OnInit {
  form;
  formData: any = {};
  isLogin: any = {};
  private fbToken;
  private authUser: any;
  constructor(
    private loginService: CommonApiService,
    fb: FormBuilder,
    private _user: UserService,
    private _jwt: JwtService,
    private topSnack: MatSnackBar,
    private fbService: FirebaseService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.form = fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.isLogin["normal"] = false;
  }

  isValid(name: string) {
    return this.form.get(name).invalid && this.form.get(name).touched;
  }

  setValue() {
    this.formData = this.form.value;
    if (this.form.valid) {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.isLogin["normal"] = true;
    this.loginService.postData("login", this.formData).subscribe(
      res => {
        if (res.hasOwnProperty(["access_token"])) {
          this._jwt.saveToken(res.access_token, res.refresh_token);
          this._user.initializeUser();
          this.fbService.getfbToken();
          // this.isLogin["normal"] = false;
        }
      },
      (error: AppError) => {
        if (error instanceof UnAuthError) {
          this.isLogin["normal"] = false;
          console.log(error.originalError.error);
          this.openSnackbar(error.originalError.error, "Dismiss");
        } else {
          throw error;
        }
      }
    );
  }

  openSnackbar(message: string, action?: string) {
    this.topSnack.open(message, action, {
      verticalPosition: "top",
      extraClasses: ["snack-bg"]
    });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(ResetDialogComponent, {
      height: "auto",
      width: "300px",
      panelClass: "reset-dialog"
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(() => {
      this.loginWithFb();
    });
  }

  loginWithFb() {
    this.authService.authState.subscribe(user => {
      this.isLogin["fb"] = true;
      if (user) {
        console.log(user);
        let data: any = {};
        data.socialUser = user;
        this.loginService.postData("facebook-login", data).subscribe(
          res => {
            if (res.hasOwnProperty(["access_token"])) {
              this._jwt.saveToken(res.access_token);
              this._user.initializeUser();
              this.fbService.getfbToken();
              // this.isLogin["fb"] = false;
            }
          },
          (error: AppError) => {
            if (error instanceof UnAuthError) {
              this.isLogin["fb"] = false;
              console.log(error.originalError.error);
              this.openSnackbar(error.originalError.error, "Dismiss");
            } else {
              throw error;
            }
          }
        );
      }
    });
  }
}
