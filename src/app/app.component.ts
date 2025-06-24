import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./Components/login/login.component";
import { PopUpComponent } from "./Components/pop-up/pop-up.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,

],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TravelHouseUK';

}
