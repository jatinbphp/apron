import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Categories', url: '/categories', icon: 'fast-food' },
    { title: 'My Orders', url: '#', icon: 'bag' },
    { title: 'My Credits', url: '#', icon: 'card' },
    { title: 'Contact', url: '#', icon: 'call' },
    { title: 'Logout', url: '#', icon: 'log-out' },
    { title: 'Login', url: '/login', icon: 'person' },
    { title: 'Register', url: '/register', icon: 'person' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private menu: MenuController) 
  {}
  closeMenu()
  {
    this.menu.close();
  }
}
