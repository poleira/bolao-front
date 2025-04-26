import { Component } from '@angular/core';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html'
})
export class RecoverPasswordComponent {
  recoverData = { email: '' };

  onRecover() {
    // Handle password recovery logic
    console.log('Recover data:', this.recoverData);
  }
}
