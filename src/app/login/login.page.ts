import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit 
{
  	public passwordType: string = 'password';
	public passwordIcon: string = 'eye-off';

  	public loginForm = this.fb.group({
		username: ['', Validators.required],
		password: ['', Validators.required]
	});

	public cartArray:any=[];
	public resultData:any=[];
	public nonce:string='';
	public userCookies:any=[];

	constructor(private fb: FormBuilder, private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController)
	{ }

	ngOnInit() 
	{ }

	async ionViewWillEnter()
	{
		this.cartArray = localStorage.getItem('cart');
		this.cartArray = (this.cartArray) ? JSON.parse(this.cartArray) : [];
	}

  	hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    	this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	async makeMeLoggedin(form)
	{
		let data={
			username:form.username, 
			password:form.password
		}
		
		//GENERATE COOKIE BEFORE LOGIN
		await this.sendRequest.getNonce().then((response:any) => 
		{
			this.nonce=response.nonce;
		  	console.log(response);
		},error => 
		{
		  console.log(error);
		});
	
		await this.sendRequest.generateUserCookies(this.nonce,data).then(resultCookie => 
		{	
		  this.userCookies = resultCookie;
		  if(this.userCookies['status']=="ok")
		  {
			localStorage.setItem('userCookie',JSON.stringify(this.userCookies));
		  }
		  //console.log(this.userCookies);
		},
		error => 
		{
		  // loading.dismiss();//DISMISS LOADER
		  console.log();
		})
		//GENERATE COOKIE BEFORE LOGIN

		//LOADER
		const loading = await this.loadingCtrl.create({
			spinner: null,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER
		
		this.sendRequest.makeMeLoggedin(data).then(result => 
		{	
      		this.sendRequest.publishSomeDataWhenLogin({
				is_user_login: true
			});//THIS OBSERVABLE IS USED TO GET SCREEN LOAD FROM ION WILL ENTER
      		this.sendRequest.showMessage("You are successfully logged in");
      		loading.dismiss();//DISMISS LOADER		
			this.resultData=result;
			let objectUser={
				user_id:this.resultData['data']['ID'],
				display_name:this.resultData['data']['display_name'],
				user_email:this.resultData['data']['user_email'],
			}
			localStorage.setItem('user',JSON.stringify(objectUser));
			//console.log(this.resultData);
			if(this.cartArray.length > 0)
			{
				this.sendRequest.router.navigate(['/cart']);
			}
			else 
			{
				this.sendRequest.router.navigate(['/home']);
			}			
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});	
	}
}
