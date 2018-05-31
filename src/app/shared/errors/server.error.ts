import { MatSnackBar } from "@angular/material";
import { AppError } from "./app-error";

export class InternalServerError extends AppError {
  constructor(originalError: any, private topSnack?: MatSnackBar) {
    super("");
    // this.openSnackbar("Oops our server seems to be busy", "Dismiss");
  }

  openSnackbar(message: string, action?: string) {
    this.topSnack.open(message, action, {
      verticalPosition: "top",
      extraClasses: ["snack-bg"]
    });
  }
}
