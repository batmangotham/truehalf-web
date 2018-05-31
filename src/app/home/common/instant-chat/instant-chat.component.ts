import { AngularFirestore } from "angularfire2/firestore";
import {
  CommonApiService,
  UserService,
  ChatService,
  MiscService,
  AppError,
  BadRequestError
} from "app/shared";
import {
  Component,
  OnInit,
  ViewChildren,
  ViewChild,
  ElementRef,
  QueryList,
  AfterViewInit,
  ViewContainerRef
} from "@angular/core";
import { Observable } from "rxjs/Observable";
import {
  Router,
  NavigationStart,
  NavigationEnd,
  RoutesRecognized
} from "@angular/router";

@Component({
  selector: "app-instant-chat",
  templateUrl: "./instant-chat.component.html",
  styleUrls: ["./instant-chat.scss"]
})
export class InstantChatComponent implements OnInit {
  @ViewChildren("messages") messages: QueryList<any>;
  @ViewChild("scrollMe") private chatWrap: ElementRef;
  userId: string;
  online: any = {};
  users: any = {};
  data: any[] = [];
  half: any[] = [];
  handle: any = {};
  unsubscribe;
  constructor(
    private onlineService: CommonApiService,
    private afs: AngularFirestore,
    private _user: UserService,
    private _chat: ChatService,
    private _router: Router,
    private _misc: MiscService
  ) {}

  ngOnInit() {
    console.log("instant chat initialized");
    this.handle.isMessage = this._router.isActive("/message", false);
    this.userId = String(this._user.getCurrentUser().id);
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handle.isMessage = this._router.isActive("/message", false);
        // console.log(this.handle.isMessage);
        if (this.handle.isMessage && this.handle.isSubscribed) {
          console.log("unsubscribe");
          this.data = [];
          this.unsubscribe();
          this.handle.isSubscribed = false;
        } else if (!this.handle.isMessage && !this.handle.isSubscribed) {
          console.log("subscribe");
          this.getChatNodeChange();
        }
      }
    });
    this.getFbOnline();
    if (!this.handle.isMessage) {
      this.getChatNodeChange();
    }
  }

  getFbOnline() {
    let onlineItem = [];
    this.afs.firestore
      .collection("users")
      .where("status", "==", "online")
      .onSnapshot(changes => {
        changes.docChanges.forEach(user => {
          if (user.doc.data().id !== this.userId) {
            if (user.type === "added") {
              // console.log("added");
              let exist: boolean;
              for (const item of onlineItem) {
                if (user.doc.data().id == item) {
                  exist = true;
                  break;
                } else {
                  exist = false;
                }
              }
              if (!exist) {
                onlineItem.push(user.doc.data().id);
              }
            }
            if (user.type === "removed") {
              for (const item of onlineItem) {
                if (user.doc.data().id == item) {
                  // console.log("removed");
                  // console.log(user.doc.data());
                  const index = onlineItem.indexOf(item);
                  onlineItem.splice(index, 1);
                }
              }
            }
          }
        });
        this.online["online_id"] = onlineItem;
        // console.log(this.online["online_id"]);
        this.getUsersById();
      });
  }

  getUsersById() {
    this.onlineService
      .postData("user/online-from-firestore", this.online)
      .subscribe(
        res => {
          if (res.status) {
            // console.log(res);
            if (res.data.total > 0) {
              this.users["item"] = res.data.data;
              this.users["loading"] = false;
              this.users["next"] = res.data.current_page + 1;
              this.users["empty"] = false;
            } else {
              this.users["loading"] = false;
              this.users["item"] = [];
              this.users["next"] = 1;
              this.users["empty"] = true;
            }
            this.users["isNext"] = res.data.last_page > res.data.current_page;
          } else {
            this.users["loading"] = false;
            this.users["empty"] = true;
          }
        },
        (error: AppError) => {
          if (error instanceof BadRequestError) {
            console.log(error);
            this.users["upgrade"] = error.originalError.error;
            this.users["loading"] = false;
          }
        }
      );
  }

  addChatPop(half) {
    half.id = String(half.id);
    const initNode = {
      lastModified: new Date(),
      lastMessage: "",
      unreadCount: 0,
      id: half.id
    };

    const chatNodeRef = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("chat_node")
      .doc(half.id);

    const msgNodeRef = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("messages")
      .doc(half.id);

    chatNodeRef.get().then(hNode => {
      if (hNode.exists) {
        console.log(hNode.data());
        console.log("Chat node exists");
        let exist: boolean;
        for (const item of this.data) {
          if (item.id === half.id) {
            exist = true;
            break;
          } else {
            exist = false;
          }
        }
        if (!exist) {
          this.data.push(half);
        }
      } else {
        console.log("Chat node does not exists");
        chatNodeRef.set(initNode).then(() => {
          console.log("Chat node created");
          msgNodeRef.set({ total: 0 }).then(() => {
            console.log("Msg node created");
            let exist: boolean;
            for (const item of this.data) {
              if (item.id === half.id) {
                exist = true;
                break;
              } else {
                exist = false;
              }
            }
            if (!exist) {
              this.data.push(half);
            }
          });
        });
      }
    });
  }

  getChatNodeChange() {
    this.handle.isSubscribed = true;
    this.unsubscribe = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("chat_node")
      .onSnapshot(data => {
        data.docChanges.forEach(changes => {
          if (changes.type === "modified") {
            // console.log(changes.doc.data());
            let exist: boolean;
            for (const item of this.data) {
              if (item.id === changes.doc.id) {
                console.log("Currently active");
                exist = true;
                break;
              } else {
                exist = false;
              }
            }
            if (!exist) {
              this.afs.firestore
                .collection("users")
                .doc(changes.doc.id)
                .get()
                .then(res => {
                  console.log(res.data());
                  this.data.unshift(res.data());
                });
            }
          }
        });
      });
  }

  getCloseIndex(event) {
    // console.log(event, "Parent");
    this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("chat_node")
      .doc(event.id)
      .update({ unreadCount: 0 })
      .then(() => {
        console.log("Unread set to 0");
        this.data.splice(event.index, 1);
      });
  }

  scrollToBottom = () => {
    console.log("scroll to bottom");
    try {
      this.chatWrap.nativeElement.scrollTop = this.chatWrap.nativeElement.scrollHeight;
    } catch (err) {}
  };
}
