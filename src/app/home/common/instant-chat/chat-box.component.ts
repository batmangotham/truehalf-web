import {
  Component,
  OnInit,
  Input,
  ViewChildren,
  ViewChild,
  QueryList,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter
} from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { UserService, ChatService } from "app/shared";

@Component({
  selector: "app-chat-box",
  templateUrl: "chat-box.html",
  styleUrls: ["instant-chat.scss"]
})
export class ChatBoxComponent implements OnInit, AfterViewInit {
  @ViewChildren("messages") messages: QueryList<any>;
  @ViewChild("scrollMe") private chatWrap: ElementRef;
  @Input() halfId: string;
  @Input() halfIndex: number;
  @Output() closeChat = new EventEmitter();
  userId: string;
  data: any[] = [];
  half: any = {};
  unsubscribe;
  constructor(
    public _user: UserService,
    private afs: AngularFirestore,
    private _chat: ChatService
  ) {
    // this.halfId = String(this.halfId);
  }

  ngOnInit() {
    this.userId = String(this._user.getCurrentUser().id);
    // console.log("half id " + this.halfId);
    if (this._user.getCurrentUser().subscription) {
      this.fetchHalf();
      this.fetchMessages();
    } else {
      this.fetchHalf();
    }
  }

  ngAfterViewInit() {
    this.messages.changes.subscribe(this.scrollToBottom);
  }

  fetchHalf() {
    this.afs.firestore
      .collection("users")
      .doc(this.halfId)
      .onSnapshot(user => {
        this.half = user.data();
      });
  }

  fetchMessages() {
    const msgRef = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("messages")
      .doc(this.halfId)
      .collection("data")
      .orderBy("createdAt", "asc");

    this.unsubscribe = msgRef.onSnapshot(data => {
      data.docChanges.forEach(msg => {
        if (msg.type === "added") {
          this.data.push(msg.doc.data());
        }
      });
      // this.messages = msgData;
      // console.log(this.data);
    });

    // unsubscribe();
  }

  scrollToBottom = () => {
    try {
      this.chatWrap.nativeElement.scrollTop = this.chatWrap.nativeElement.scrollHeight;
    } catch (err) {}
  };

  sendMessage(event) {
    if (this.half.text) {
      this._chat.sendMessage(this.halfId, this.half.text);
      this.half.text = "";
    }
  }

  closeBox() {
    if (this._user.getCurrentUser().subscription) {
      this.unsubscribe();
    }
    let closeData = {};
    console.log(this.half);
    closeData["index"] = this.halfIndex;
    closeData["id"] = String(this.halfId);
    this.closeChat.emit(closeData);
  }
}
