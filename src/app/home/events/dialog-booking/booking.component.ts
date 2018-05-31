import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  templateUrl: "booking.html"
})
export class EventBookingDialogComponent implements OnInit {
  seats = [];
  count: number;
  constructor(
    public dialogRef: MatDialogRef<EventBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log(this.data);
    if (this.data.type === "free") {
      const maxSeat = this.data.max_seat_per_head;
      for (let i = 1; i <= maxSeat; i++) {
        let item = {};
        item["value"] = i;
        this.seats.push(item);
      }
    }
    if (this.data.type === "paid") {
    } else {
    }
  }
}
