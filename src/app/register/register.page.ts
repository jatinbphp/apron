import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit 
{
	public passwordType: string = 'password';
	public passwordIcon: string = 'eye-off';
	public ConfirmPasswordType: string = 'password';
	public ConfirmPasswordIcon: string = 'eye-off';
	public nonce:string='';
	public resultDataSignup:any=[];
	public accept_tems:boolean=false;

	public registerForm = this.fb.group({
		email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
		username: ['', Validators.required],
		cpassword: ['', Validators.required],
		password: ['', Validators.required],
		accept_tems: [''],
		},{validator: this.checkIfMatchingPasswords('password', 'cpassword')
	});

	constructor(private fb: FormBuilder, private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController, private inAppBrowser: InAppBrowser)
	{ }

	ngOnInit()
	{ }

  	async ionViewWillEnter() 
	{
		await this.sendRequest.getNonce().then((response:any) => 
		{	console.log(response);
			this.nonce=response.nonce;
		},
		error => 
		{});
	}

  	checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string)
	{
		return (group: FormGroup) => 
		{
	    	let passwordInput = group.controls[passwordKey],passwordConfirmationInput = group.controls[passwordConfirmationKey];
			if (passwordInput.value !== passwordConfirmationInput.value)
			{
				return passwordConfirmationInput.setErrors({notEquivalent: true})
			}
			else
			{
        		return passwordConfirmationInput.setErrors(null);
      		}
	  	}
	}

  	hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    	this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	hideShowConfirmPassword()
	{
		this.ConfirmPasswordType = this.ConfirmPasswordType === 'text' ? 'password' : 'text';
    	this.ConfirmPasswordIcon = this.ConfirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

  	async register(form,nonce)
	{
		//LOADER
		const loading = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER register
		this.sendRequest.register(form,this.nonce).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultDataSignup=result;
			if(this.resultDataSignup.status=="ok")
			{
				this.sendRequest.showMessage("You are successfully registered!<br/>Please login.");
				this.sendRequest.router.navigate(['/login']);
			}
			if(this.resultDataSignup.status=="error")
			{
				this.sendRequest.router.navigate(['/register']);
				this.sendRequest.showMessage(this.resultDataSignup.error);
			}
		},
		error => 
		{			
			loading.dismiss();//DISMISS LOADER
		})		
		/**/
	}

	acceptTerms(ev)
  {
    let haveStatus = ev.detail.checked;
    if(haveStatus == true)
    {
      this.accept_tems = true;
    }
    else 
    {
      this.accept_tems = false;
    }
  }

	openActionRequested(targetUrl)
	{
		const options : InAppBrowserOptions = {
			location : 'yes',//Or 'no' 
			hidden : 'no', //Or  'yes'
			clearcache : 'yes',
			clearsessioncache : 'yes',
			zoom : 'yes',//Android only ,shows browser zoom controls 
			hardwareback : 'yes',
			mediaPlaybackRequiresUserAction : 'no',
			shouldPauseOnSuspend : 'no', //Android only 
			closebuttoncaption : 'Close', //iOS only
			disallowoverscroll : 'no', //iOS only 
			toolbar : 'yes', //iOS only 
			enableViewportScale : 'no', //iOS only 
			allowInlineMediaPlayback : 'no',//iOS only 
			presentationstyle : 'pagesheet',//iOS only 
			fullscreen : 'yes',//Windows only    
		  };
		  let target = "_blank";
		  this.inAppBrowser.create(targetUrl,target,options);
	}
}
