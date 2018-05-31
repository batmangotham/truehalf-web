import { Component, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CropperSettings, ImageCropperComponent } from "ng2-img-cropper";
import { CommonApiService, UserService } from "app/shared";

@Component({
  templateUrl: "crop-dialog.component.html"
})
export class CropDialogComponent {
  isUpload: boolean;
  save: boolean;
  url: any = {};
  imgData: any = {};
  user: any = {};
  cropSettings: CropperSettings;
  status: any = {};
  @ViewChild("cropper", undefined)
  cropper: ImageCropperComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CropDialogComponent>,
    private updateService: CommonApiService,
    private userService: UserService
  ) {
    this.cropSettings = new CropperSettings();
    this.cropSettings.width = 400;
    this.cropSettings.height = 400;
    this.cropSettings.croppedWidth = 400;
    this.cropSettings.croppedHeight = 400;
    this.cropSettings.canvasWidth = 300;
    this.cropSettings.canvasHeight = 300;
    this.cropSettings.noFileInput = true;
    this.cropSettings.minWithRelativeToResolution = true;
    this.cropSettings.keepAspect = true;
    this.imgData = {};
    this.save = false;
    this.user = this.userService.getCurrentUser();
    this.isUpload = false;
  }

  saveImg() {
    this.save = true;
    if (this.save) {
      this.url["profile_image"] = this.imgData.image;
      this.postProfile();
    } else {
      this.url = [];
    }
  }

  postProfile() {
    this.isUpload = true;
    this.updateService.postData("add-profile-img", this.url).subscribe(res => {
      if (res.status) {
        this.user["profile_pic"] = res.data.images;
        this.userService.updateCurrentUserSubject(this.user);
        this.updateStatus();
        this.dialogRef.close();
      }
    });
  }

  updateStatus() {
    this.status["update_status"] = 1;
    this.updateService.postData("update-status", this.status).subscribe(res => {
      window.location.href = "/home";
    });
  }

  getImage(e?) {
    console.log(this.imgData);
    return this.imgData;
  }

  // multiUpload() {
  //   this.updateService.postData("add-media", this.url).subscribe(res => {});
  // }

  fileChangeListener($event) {
    console.log("change");
    this.imgData["image"] = "stuff";
    const image: any = new Image();
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function(loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
  }
}
