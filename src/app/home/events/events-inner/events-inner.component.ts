import { EventBookingDialogComponent } from "./../dialog-booking/booking.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CommonApiService } from "app/shared";

@Component({
  templateUrl: "events-inner.component.html"
})
export class EventsInnerComponent implements OnInit {
  data: any = {};
  name: string;
  private _sub;
  constructor(
    private eventService: CommonApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _router: Router
  ) {}

  ngOnInit() {
    this._sub = this.route.params.subscribe(param => {
      this.name = param["name"];
      console.log(this.name);
      this.getEvent();
    });
  }

  getEvent() {
    this.eventService.getData("events/" + this.name, {}).subscribe(res => {
      if (res.status && res.data) {
        this.data = res.data;
      }
    });
  }

  openBooking() {
    if (this.data.payment_status) {
      this._router.navigateByUrl(`/events/book/${this.data.slug}`);
    } else {
      this.openDialog();
    }
  }

  openDialog() {
    let dialogRef = this.dialog.open(EventBookingDialogComponent, {
      width: "300px",
      panelClass: "event-booking",
      data: this.data
    });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
