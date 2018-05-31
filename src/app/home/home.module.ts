import { EventSuccessComponent } from "./events/event-success/event.success.component";
import { EventBookComponent } from "./events/events-inner/event-booking/event-book.component";
import { NotFoundComponent } from "./../shared/404/notfound.component";
import { EventBookingDialogComponent } from "./events/dialog-booking/booking.component";
import { ImageCropperModule } from "ng2-img-cropper";
import { UpgradeDialogComponent } from "./upgrade/upgrade-dialog/upgrade-dialog.component";
import { UpgradeComponent } from "./upgrade/upgrade.component";
import { UpgradeSuccessComponent } from "./upgrade/upgrade-success/upgrade-success.component";
import { UpgradePlansComponent } from "./upgrade/upgrade-plans/upgrade-plans.component";
import { UpgradeBlockComponent } from "./common/upgrade/upgrade-block.component";
import { SettingsComponent } from "./settings/setting.component";
import { ChatBoxComponent } from "./common/instant-chat/chat-box.component";
import { CreateChatComponent } from "./message/create-chat/create-chat.component";
import { LoadingComponent } from "./common/loading/loading.component";
import { ProfileImageDialogComponent } from "./common/profileImage-dialog/profileimage-dialog.component";
import { HalfLifestyleComponent } from "./profile/half-lifestyle/half-lifestyle.component";
import { HalfBackgroundComponent } from "./profile/half-background/half-background.component";
import { HalfAppearanceComponent } from "./profile/half-appearance/half-appearance.component";
import { HalvesComponent } from "./halves/halves.component";
import { EventsInnerComponent } from "./events/events-inner/events-inner.component";
import { HalfProfileComponent } from "./half-profile/half-profile.component";
import { SearchComponent } from "./search/search.component";
import { ProfileLifestyleComponent } from "./profile/lifestyle/lifestyle.component";
import { InstantChatComponent } from "./common/instant-chat/instant-chat.component";
import { UserCardComponent } from "./common/user-card/user-card.component";
import { EventsComponent } from "./events/events.component";
import { WinFavViewComponent } from "./winfavview/winfavview.component";
import { OnlineComponent } from "./online/online.component";
import { MainHomeComponent } from "./main-home/main-home.component";
import { CropDialogComponent } from "./crop-dialog/crop-dialog.component";
import { UploadphotoComponent } from "./basicprofile/uploadphoto/uploadphoto.component";
import { MaterialModule } from "./../shared/material/material.module";
import {
  NgModule,
  ModuleWithProviders,
  CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { RouterModule } from "@angular/router";
import {
  SharedModule,
  AuthGuard,
  HeaderComponent,
  FooterComponent
} from "../shared";
import {
  AlertModule,
  PopoverModule,
  TypeaheadModule,
  CarouselModule
} from "ngx-bootstrap";
import { BasicprofileComponent } from "./basicprofile/basicprofile.component";
import { ProfileComponent } from "app/home/profile/profile.component";
import { ProfileAppearanceComponent } from "app/home/profile/appearance/appearance.component";
import { ProfileBackgroundComponent } from "app/home/profile/background/background.component";
import { MessageWithComponent } from "./message";
import { MessageListComponent } from "./message";
const homeRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: "basic",
    component: BasicprofileComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "upload",
        pathMatch: "full"
      },
      {
        path: "upload",
        component: UploadphotoComponent
      }
    ]
  },
  {
    path: "upgrade",
    component: UpgradeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "plans/subscription",
        pathMatch: "full"
      },
      {
        path: "plans/:type",
        component: UpgradePlansComponent
      },
      {
        path: ":status",
        component: UpgradeSuccessComponent
      }
    ]
  },
  {
    path: "events/payment/:status",
    component: EventSuccessComponent
  },
  {
    path: "",
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      },
      {
        path: "home",
        component: MainHomeComponent
      },
      {
        path: "online",
        component: OnlineComponent
      },
      {
        path: "profile",
        component: ProfileComponent
      },
      {
        path: "profile/:id",
        component: HalfProfileComponent
      },
      {
        path: "more/:type",
        component: WinFavViewComponent
      },
      {
        path: "events",
        component: EventsComponent
      },
      {
        path: "events/:name",
        component: EventsInnerComponent
      },
      {
        path: "events/book/:name",
        component: EventBookComponent
      },
      {
        path: "search",
        component: SearchComponent
      },
      {
        path: "halves",
        component: HalvesComponent
      },
      {
        path: "settings",
        component: SettingsComponent
      },
      {
        path: "message",
        component: MessageListComponent,
        children: [
          {
            path: "",
            redirectTo: "create-chat",
            pathMatch: "full"
          },
          {
            path: "create-chat",
            component: CreateChatComponent
          },
          {
            path: "th-key/:id",
            component: MessageWithComponent
          }
        ]
      },
      {
        path: "404",
        component: NotFoundComponent
      },
      {
        path: "**",
        redirectTo: "/404"
      }
    ]
  }
]);
@NgModule({
  imports: [
    homeRouting,
    CommonModule,
    SharedModule,
    MaterialModule,
    AlertModule.forRoot(),
    PopoverModule.forRoot(),
    TypeaheadModule.forRoot(),
    CarouselModule.forRoot(),
    ImageCropperModule
  ],
  declarations: [
    HeaderComponent,
    HomeComponent,
    BasicprofileComponent,
    UploadphotoComponent,
    CropDialogComponent,
    MainHomeComponent,
    OnlineComponent,
    WinFavViewComponent,
    EventsComponent,
    UserCardComponent,
    InstantChatComponent,
    ProfileComponent,
    ProfileAppearanceComponent,
    ProfileBackgroundComponent,
    ProfileLifestyleComponent,
    SearchComponent,
    HalfProfileComponent,
    EventsInnerComponent,
    HalvesComponent,
    HalfAppearanceComponent,
    HalfBackgroundComponent,
    HalfLifestyleComponent,
    ProfileImageDialogComponent,
    LoadingComponent,
    MessageListComponent,
    MessageWithComponent,
    CreateChatComponent,
    ChatBoxComponent,
    UpgradeBlockComponent,
    SettingsComponent,
    UpgradeComponent,
    UpgradePlansComponent,
    UpgradeSuccessComponent,
    UpgradeDialogComponent,
    EventBookingDialogComponent,
    EventBookComponent,
    NotFoundComponent,
    EventSuccessComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    CropDialogComponent,
    UpgradeDialogComponent,
    ProfileImageDialogComponent,
    EventBookingDialogComponent
  ]
})
export class HomeModule {}
