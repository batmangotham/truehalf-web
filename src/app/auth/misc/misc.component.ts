import { MatDialog } from "@angular/material";
import { UserService, ContactDialogComponent } from "app/shared";
import { ActivatedRoute } from "@angular/router";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2
} from "@angular/core";
import { ResetDialogComponent } from "app/auth/password-reset/reset-dialog/reset-dialog.component";
import { Subscription } from "rxjs";

@Component({
  templateUrl: "misc.component.html"
})
export class MiscComponent implements OnInit {
  type: string;
  data: any = {};
  _sub1: Subscription;
  _sub2: Subscription;
  auth: boolean;
  @ViewChild("abcd") private abcd: ElementRef;
  constructor(
    private _route: ActivatedRoute,
    private _user: UserService,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) {}
  ngOnInit() {
    this._sub1 = this._route.params.subscribe(param => {
      window.scrollTo(0, 0);
      this.type = param["type"];
      console.log(param);
    });

    this._sub2 = this._user.isAuthenticated.subscribe(res => {
      this.auth = res;
    });
  }

  ngAfterViewChecked() {
    // this.setStyle();
  }

  setStyle() {
    const item = this.abcd.nativeElement.offsetWidth;
    console.log(item);
    if (item) {
      const iEl = this.abcd.nativeElement.querySelector("iframe");
      console.log(iEl);
    }
    // this.renderer.removeStyle(item, "width");
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(ResetDialogComponent, {
      height: "auto",
      width: "300px",
      panelClass: "reset-dialog"
    });
  }

  openContact(): void {
    let dialogRef = this.dialog.open(ContactDialogComponent, {
      height: "auto",
      width: "300px",
      panelClass: "reset-dialog"
    });
  }

  ngOnDestroy() {
    this._sub1.unsubscribe();
    this._sub2.unsubscribe();
  }
}
