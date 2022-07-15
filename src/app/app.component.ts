import { Component, VERSION } from "@angular/core";
import { PopoverService } from "./popover/popover.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(private popoverService: PopoverService) {}

  nome = "";
  telefone = "";
  endereco = "";

  closePopover() {
    this.popoverService.setState(true);
  }
}
