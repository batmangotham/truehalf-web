import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Component, Inject } from "@angular/core";

@Component({
  templateUrl: "upgrade-dialog.html",
  styleUrls: ["upgrade-dialog.scss"]
})
export class UpgradeDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpgradeDialogComponent>
  ) {}
}
