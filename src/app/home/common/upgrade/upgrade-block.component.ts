import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-upgrade",
  templateUrl: "upgrade-block.component.html",
  styleUrls: ["./upgrade-block.component.scss"]
})
export class UpgradeBlockComponent implements OnInit {
  @Input() data: any;

  constructor() {}

  ngOnInit() {}
}
