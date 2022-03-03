import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SendReceiveRequestsService } from './providers/send-receive-requests.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent 
{
  public is_user_login:boolean=false;
  public userArray:any=[]; 
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home', is_function:0, show:1 },//[0]
    { title: 'Categories', url: '/categories-main', icon: 'fast-food', is_function:0, show:1 },//[1]
    { title: 'Search', url: '/search', icon: 'search', is_function:0, show:1 },//[2]
    { title: 'My Orders', url: '/orders', icon: 'bag', is_function:0, show:0 },//[3]
    { title: 'My Credits', url: '#', icon: 'card', is_function:0, show:0 },//[4]
    { title: 'Contact', url: '/contact', icon: 'call', is_function:0, show:1 },//[5]
    { title: 'Logout', url: '#', icon: 'log-out', is_function:1, show:0 },//[6]
    { title: 'Login', url: '/login', icon: 'person', is_function:0, show:1 },//[7]
    //{ title: 'Register', url: '/register', icon: 'person', is_function:0, show:0 },//[8]
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  
  constructor(private menu: MenuController, private sendRequest: SendReceiveRequestsService) 
  {
    this.sendRequest.getObservableWhenLogin().subscribe((dataLogin) => 
		{
			this.is_user_login=dataLogin.is_user_login;
      if(this.is_user_login == true)
      {
        this.appPages[3]['show']=1;
        this.appPages[4]['show']=1;
        this.appPages[6]['show']=1;
        this.appPages[7]['show']=0;
      }
      if(this.is_user_login == false)
      {
        this.appPages[3]['show']=0;
        this.appPages[4]['show']=0;
        this.appPages[6]['show']=0;
        this.appPages[7]['show']=1;
      }
		});//THIS OBSERVABLE IS USED TO CHECK USER LOGIN
    this.InitializeAPP();
  }

  async InitializeAPP()
  {
    this.userArray=[];
    this.userArray = localStorage.getItem('user');
    this.userArray = (this.userArray) ? JSON.parse(this.userArray) : [];
    if(this.userArray['user_id'] > 0)
    {
      this.appPages[3]['show']=1;
      this.appPages[4]['show']=1;
      this.appPages[6]['show']=1;
      this.appPages[7]['show']=0;
    }
    else
    {
      this.appPages[3]['show']=0;
      this.appPages[4]['show']=0;
      this.appPages[6]['show']=0;
      this.appPages[7]['show']=1;
    }
  }

  closeMenu()
  {
    this.menu.close();
  }

  Logout()
  {
    this.sendRequest.publishSomeDataWhenLogin({
      is_user_login: false
    });//THIS OBSERVABLE IS USED TO CHECK USER LOGIN
    localStorage.clear();
    this.sendRequest.router.navigate(['/home']);
  }
}
