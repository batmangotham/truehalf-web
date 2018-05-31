import { UrlUtils } from "./../../shared/services/url.service";
import { UserService } from "./../../shared/services/user.service";
import { Router } from "@angular/router";
import { CommonApiService } from "./../../shared/services/common.service";
import { CropDialogComponent } from "./../crop-dialog/crop-dialog.component";
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-basicprofile",
  templateUrl: "./basicprofile.component.html",
  styleUrls: ["./basicprofile.component.css"]
})
export class BasicprofileComponent implements OnInit {
  user: any = {};
  status: any = {};
  constructor(
    public dialog: MatDialog,
    private updateService: CommonApiService,
    private route: Router,
    private _user: UserService,
    public url: UrlUtils
  ) {}

  ngOnInit() {
    this.user = this._user.getCurrentUser();
  }

  openModal() {
    const dialogRef = this.dialog.open(CropDialogComponent, {
      height: "auto",
      width: "300px",
      panelClass: "crop-dialog"
    });
  }

  updateStatus() {
    this.status["update_status"] = 1;
    this.updateService.postData("update-status", this.status).subscribe(res => {
      // window.location.href = "/home";
    });
  }
}
