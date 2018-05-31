import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonApiService, AppError, BadRequestError } from "app/shared";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material";
import { EventBookingDialogComponent } from "app/home/events/dialog-booking/booking.component";

@Component({
  templateUrl: "book.html"
})
export class EventBookComponent implements OnInit {
  _sub: Subscription;
  type: string;
  data: any = {};
  booked_seats = [];
  constructor(
    private _route: ActivatedRoute,
    private eventService: CommonApiService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this._sub = this._route.params.subscribe(param => {
      this.type = param["name"];
    });
    this.getEvent();
  }

  getEvent() {
    this.eventService.getData(`events/${this.type}`, {}).subscribe(res => {
      if (res.status && res.data) {
        this.data = res.data;
        console.log(this.data);
      }
    });
  }

  selectSeat(item) {
    if (!item.booked_status) {
      if (this.booked_seats.indexOf(item.seat_no) === -1) {
        console.log("does not exist");
        if (this.booked_seats.length < this.data.max_seat_per_head) {
          this.booked_seats.push(item.seat_no);
          console.log(this.booked_seats);
          item["checked"] = true;
        } else {
          this.openDialog(this.data.max_seat_per_head, "paid");
        }
      } else {
        console.log("exist");
        const index = this.booked_seats.indexOf(item.seat_no);
        console.log(index, "index");
        this.booked_seats.splice(index, 1);
        console.log(this.booked_seats);
        item["checked"] = false;
      }
    }
  }

  openDialog(_item: any, _type: string) {
    let dialogRef = this.dialog.open(EventBookingDialogComponent, {
      width: "300px",
      panelClass: "event-booking",
      data: { item: _item, type: _type }
    });
  }

  bookEvent() {
    this.data["check"] = true;
    let data: any = {};
    data["payment_type"] = 4;
    data["payment_id"] = this.data.id;
    data["booked_seats"] = this.booked_seats;
    console.log(data);
    this.eventService.postData("paypal/create-payment", data).subscribe(
      res => {
        console.log(res);
        if (res.status) {
          // this.data["check"] = false;
          window.localStorage["current_event"] = JSON.stringify(
            res.data.subscription_start
          );
          console.log(window.localStorage);
          window.location.href = res.data.url;
        }
      },
      (error: AppError) => {
        this.data["check"] = false;
        if (error instanceof BadRequestError) {
          let message = error.originalError.error;
          this.openDialog(message, "message");
        }
      }
    );
  }
}
