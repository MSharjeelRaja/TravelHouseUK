import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { LoginService } from '../../Services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.css',
})
export class PopUpComponent implements OnInit {
  Type: string = 'error';
  loader = false;
  alertType = 'Error';
  message = 'Invalid email or password!';
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: LoginService
  ) {}

  ngOnInit() {
    if (this.data?.alertType) {
      this.Type = this.data.alertType;
        this.alertType = this.data.alertType;
          this.message = this.data.message;
    }
  }

  deleteFaq(): void {
    const id = this.data?.id;
    if (!id) alert('returning');

    this.loader = true;
    this.service.deleteFaq(id).subscribe({
      next: () => {
        this.loader = false;

        const popupRef = this.dialog.open(PopUpComponent, {
          width: '500px',
          data: { alertType: 'success' },
        });

        popupRef.afterClosed().subscribe(() => {
          this.dialogRef.close('refresh');
        });
      },
      error: (error: any) => {
        this.loader = false;
        console.error('API error:', error);
      },
    });
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}
