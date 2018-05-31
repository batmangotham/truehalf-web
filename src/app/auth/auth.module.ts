import { MiscComponent } from "./misc/misc.component";
import { ResetDialogComponent } from "./password-reset/reset-dialog/reset-dialog.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";
import { VerifyMailComponent } from "./verify-mail/verify-mail.component";
import { MaterialModule } from "./../shared/material/material.module";
import { BlogHeaderComponent } from "./blog/blog-header.component";
import { BlogInnerComponent } from "./blog/blog-inner/blog-inner.component";
import { BlogComponent } from "./blog/blog.component";
import { BlogTypeComponent } from "./blog/blog-type/blog-type.component";
import { LandingFooterComponent } from "./landing-footer.component";
import { LandingHeaderComponent } from "./landing-header.component";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { RouterModule } from "@angular/router";
import { NoAuthGuard } from "./no-auth-guard";
import { SharedModule } from "../shared";
import { BsDatepickerModule } from "ngx-bootstrap";
import { TypeaheadModule } from "ngx-bootstrap";
import { RegisterSuccessComponent } from "app/auth/register/register-succes/register-success.component";

const authRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: "login",
    component: LoginComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: "verify-mail/:code",
    component: VerifyMailComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: "success",
    component: RegisterSuccessComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: "blog",
    component: BlogComponent,
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      },
      {
        path: ":type",
        component: BlogTypeComponent
      },
      {
        path: "inner/:type/:slug",
        component: BlogInnerComponent
      }
    ]
  },
  {
    path: "misc/:type",
    component: MiscComponent
  },
  {
    path: "password-reset/:token",
    component: PasswordResetComponent,
    canActivate: [NoAuthGuard]
  }
  // {
  //   path: "**",
  //   redirectTo: "login",
  //   canActivate: [NoAuthGuard]
  // }
]);

@NgModule({
  imports: [
    CommonModule,
    authRouting,
    SharedModule,
    MaterialModule,
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot()
  ],
  providers: [NoAuthGuard],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LandingHeaderComponent,
    LandingFooterComponent,
    BlogComponent,
    BlogInnerComponent,
    BlogHeaderComponent,
    BlogTypeComponent,
    VerifyMailComponent,
    RegisterSuccessComponent,
    PasswordResetComponent,
    ResetDialogComponent,
    MiscComponent
  ],
  entryComponents: [ResetDialogComponent]
})
export class AuthModule {}
