import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  AfterViewChecked
} from "@angular/core";
import { CommonApiService, UserService } from "app/shared";
import { CropperSettings, ImageCropperComponent } from "ng2-img-cropper";

@Component({
  templateUrl: "profileimage-dialog.component.html"
})
export class ProfileImageDialogComponent {
  cropSettings: CropperSettings;
  @ViewChild("cropper", undefined)
  cropper: ImageCropperComponent;
  imgData: any = {};
  user: any = {};
  position: number;
  url: any = {};
  width: number;
  maxWidth: number;
  nav: any = {};
  index: number;
  loading: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProfileImageDialogComponent>,
    private updateService: CommonApiService,
    private userService: UserService
  ) {
    this.loading = false;
    this.user["images"] = this.userService.getCurrentUser().images;
    console.log(this.user);
    this.getImages();
    this.cropSettings = new CropperSettings();
    this.cropSettings.width = 400;
    this.cropSettings.height = 400;
    this.cropSettings.croppedWidth = 400;
    this.cropSettings.croppedHeight = 400;
    this.cropSettings.canvasWidth = 300;
    this.cropSettings.canvasHeight = 300;
    this.cropSettings.noFileInput = true;
    this.cropSettings.minWithRelativeToResolution = false;
    this.cropSettings.keepAspect = true;
    this.position = 0;
    this.width = 245;
    this.maxWidth = 0;
    this.nav["position"] = -60 * (this.user.images.length - 3);
    this.nav["maxWidth"] = 60 * (this.user.images.length - 3) + 245;
    this.nav["width"] = this.nav["maxWidth"];
    this.nav["slide"] = true;
    this.nav["length"] = this.user.images.length;
    this.nav["upload"] = false;
    if (!this.data.type) {
      this.index = this.user.images.length - 1;
    }
    // this.updateImage();
  }

  getImage(e?) {
    return this.imgData;
  }

  deletePic() {
    this.updateService
      .deleteData("delete-media/" + this.nav["id"], {})
      .subscribe(res => {
        if (res.status) {
        }
      });
  }

  setProfilePic() {
    let data: any = {};
    if (this.index >= 0) {
      this.userService.getCurrentUser().profile_pic = this.user.images[
        this.index
      ].images;
      data["image_id"] = this.user.images[this.index].id;
      this.updateService.postData("set-profile-img", data).subscribe(res => {
        if (res.status) {
        }
      });
    } else {
      console.log("index is 0");
      this.data.type = true;
      this.userService.getCurrentUser().profile_pic =
        "http://truehalf.bravocodesolutions.com/uploads/user-dummy.png";
    }
  }

  fileChangeListener($event) {
    this.data.type = true;
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

  navigate(p) {
    const newLength = this.user.images.length - 3;
    this.nav["maxWidth"] = 60 * newLength + 245;
    if (p === "r") {
      this.nav["position"] = this.nav["position"] - 60;
      this.nav["width"] = this.nav["width"] + 60;
    } else {
      this.nav["position"] = this.nav["position"] + 60;
      this.nav["width"] = this.nav["width"] - 60;
    }
  }

  upload() {
    this.nav["upload"] = true;
    this.url["image"] = this.imgData.image;
    this.updatePosition();
    this.updateService.postData("add-media", this.url).subscribe(res => {
      if (res.status) {
        this.nav["upload"] = false;
        this.imgData = {};
        this.user["images"].push(res.data);
        this.updatePosition();
      }
    });
  }

  isNext() {
    if (this.nav["width"] === this.nav["maxWidth"]) {
      return false;
    } else {
      return true;
    }
  }

  updatePosition() {
    console.log(this.user.images);
    this.nav["position"] = -60 * (this.user.images.length - 3);
    this.nav["maxWidth"] = 60 * (this.user.images.length - 3) + 245;
    this.nav["width"] = this.nav["maxWidth"];
  }

  clickNav(i) {
    this.data.type = false;
    this.index = i;
  }

  deleteImage() {
    console.log(this.index);
    if (this.index >= 0) {
      this.nav["id"] = this.user.images[this.index].id;
      this.deletePic();
      this.user.images.splice(this.index, 1);
      this.index = this.index - 1;
      this.updatePosition();
      this.setProfilePic();
    }
  }

  getImageIndex() {
    if (this.index >= 0) {
      this.nav["id"] = this.user.images[this.index].id;
      return this.user.images[this.index].images;
    }
  }

  carouselNav(nav) {
    // console.log(this.nav.length);
    if (nav === "l") {
      if (this.index > 0) {
        this.index = this.index - 1;
        if (this.nav.width > 245) {
          this.nav["position"] = this.nav["position"] + 60;
          this.nav["width"] = this.nav["width"] - 60;
        }
      }
    } else {
      if (this.index < this.user.images.length - 1) {
        this.index = this.index + 1;
        this.updatePosition();
      }
    }
    console.log(this.index);
  }

  getImages() {
    this.updateService.getData("get-user", {}).subscribe(res => {
      if (res.status) {
        this.userService.getCurrentUser().images = res.data.images;
        this.user["images"] = res.data.images;
        this.loading = true;
      }
    });
  }
}
