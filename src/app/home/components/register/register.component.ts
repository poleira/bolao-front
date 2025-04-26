import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerData = { name: '', email: '', password: '' };

  onRegister() {
    // Handle registration logic
    console.log('Register data:', this.registerData);
  }
}
