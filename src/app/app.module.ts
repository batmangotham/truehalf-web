import { UrlUtils } from "./shared/services/url.service";
import {
  SocialLoginModule,
  AuthServiceConfig,
  FacebookLoginProvider
} from "angular4-social-login";
import { ChatService } from "./shared/services/chat.service";
import { MiscService } from "./shared/services/misc.service";
import { ConnectivityService } from "./shared/services/connectivity.service";
import { CommonApiService } from "./shared/services/common.service";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "angularfire2";
import { environment } from "./../environments/environment";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";
import {
  NgModule,
  ModuleWithProviders,
  ErrorHandler,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from "@angular/core";
import { AppComponent } from "./app.component";
import { HomeModule } from "./home/home.module";
import { CommonModule } from "@angular/common";
import {
  HeaderComponent,
  FooterComponent,
  AppErrorHanlder,
  AppError,
  ApiService,
  AuthGuard,
  UserService,
  JwtService,
  SharedModule,
  MaterialModule
} from "./shared/";
import { AuthModule } from "./auth/auth.module";
import { RouterModule } from "@angular/router";
import { FirebaseService } from "./shared/services/firebase.service";
// const fbLoginOptions: LoginOpt = {
//   scope: "user_birthday,user_photos",
//   return_scopes: true,
//   enable_profile_selector: true
// };
let config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("837914609712655")
  }
]);
export function provideConfig() {
  return config;
}
const rootRouting: ModuleWithProviders = RouterModule.forRoot([]);

@NgModule({
  declarations: [AppComponent, FooterComponent],
  exports: [],
  imports: [
    BrowserModule,
    rootRouting,
    SharedModule,
    AuthModule,
    HomeModule,
    MaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase, "Truehalf"),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    SocialLoginModule
  ], // CommonModule,,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    JwtService,
    UserService,
    AuthGuard,
    ApiService,
    CommonApiService,
    ConnectivityService,
    MiscService,
    ChatService,
    FirebaseService,
    UrlUtils,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  // { provide: ErrorHandler, useClass: AppErrorHanlder } // uncomment when in productions,
  bootstrap: [AppComponent]
})
export class AppModule {}
