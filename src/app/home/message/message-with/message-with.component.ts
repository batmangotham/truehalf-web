import { MiscService } from "./../../../shared/services/misc.service";
import { ActivatedRoute } from "@angular/router";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  HostListener,
  QueryList,
  ViewChildren,
  EventEmitter,
  Output
} from "@angular/core";
import { ChatService, UserService, CommonApiService } from "app/shared";
import { AngularFirestore } from "angularfire2/firestore";
import { AfterViewInit } from "@angular/core/src/metadata/lifecycle_hooks";

@Component({
  selector: "app-message-with",
  templateUrl: "with.html"
})
export class MessageWithComponent implements OnInit, AfterViewInit {
  @Output() deleteCheck = new EventEmitter<boolean>();
  @ViewChildren("messages") messages: QueryList<any>;
  @ViewChild("scrollMe") private chatWrap: ElementRef;
  userId: string;
  halfId: string;
  threadKey: any;
  half: any = {};
  message: string;
  data: any = [];
  isTop: boolean;
  unsubscribe;
  truhalf: boolean;
  // halfId: string;
  constructor(
    private chat: ChatService,
    private _route: ActivatedRoute,
    public userService: UserService,
    private afs: AngularFirestore,
    private misc: MiscService,
    private _common: CommonApiService
  ) {
    this.userId = this.userService.getCurrentUser().id + "";
    this.chat.userId = this.userId;
  }
  ngOnInit() {
    this._route.params.subscribe(param => {
      if (param["id"] === "007") {
        console.log("007 true");
        this.truhalf = true;
        this.halfId = "";
      } else {
        this.truhalf = false;

        if (this.data.fetched) {
          this.unsubscribe();
        }
        this.halfId = param["id"];
        if (this.userService.getCurrentUser().subscription) {
          console.log();
          this.half = this.chat.getHalfDetails();
          this.fetchMessages();
        }
      }
    });
    if (!this.truhalf) {
      if (this.halfId) {
        this.fetchHalfDetails();
      }
    }
  }

  ngAfterViewInit() {
    this.messages.changes.subscribe(this.scrollToBottom);
  }

  fetchMessages() {
    this.data = [];
    this.data["fetched"] = true;
    this.data["loading"] = true;
    const msgRef = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("messages")
      .doc(this.halfId)
      .collection("data")
      .orderBy("createdAt", "asc");
    let messages = [];
    this.unsubscribe = msgRef.onSnapshot(data => {
      data.docChanges.forEach(msg => {
        if (msg.type === "added") {
          messages.push(msg.doc.data());
          this.data["msg"] = messages;
        }
      });
      if (!messages.length) {
        this.data["empty"] = true;
      }
      this.data["loading"] = false;
    });
  }

  sendMessage() {
    if (this.message) {
      this.chat.sendMessage(this.halfId, this.message);
      this.message = "";
    }
  }

  keyDownFunction(event) {
    this.sendMessage();
    // this.ScrolltoBottom();
  }

  scrollToBottom = () => {
    // if (!this.isTop) {
    try {
      this.chatWrap.nativeElement.scrollTop = this.chatWrap.nativeElement.scrollHeight;
    } catch (err) {}
    // }
  };

  fetchHalfDetails() {
    this.afs.firestore
      .collection("users")
      .doc(this.halfId)
      .get()
      .then(res => {
        this.half.name = res.data().displayName;
      });
  }

  // @HostListener("scroll", ["$event"])
  onScroll(event) {
    try {
      const top = event.target.scrollTop;
      const height = this.chatWrap.nativeElement.scrollHeight;
      const offset = this.chatWrap.nativeElement.offsetHeight;

      if (top > height - offset - 1) {
        // console.log("bottom");
      }
      if (top === 0) {
        this.isTop = true;
        // console.log("top");
      }
    } catch (error) {}
  }

  deleteChat() {
    this.truhalf = false;
    this.misc.deleteNode();
    this._common.getData("hide-msg", {}).subscribe(res => {
      console.log(res);
    });
  }

  ngOnDestroy() {
    if (this.data.fetched) {
      this.unsubscribe();
    }
  }
}
