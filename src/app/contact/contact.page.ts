import { Component, OnInit } from '@angular/core';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserObject } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})

export class ContactPage implements OnInit 
{
  public cartArray:any=[];
  public number_of_products_in_cart:number=0;//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
  constructor(private sendRequest: SendReceiveRequestsService, private inAppBrowser: InAppBrowser)
  { 
    this.sendRequest.getObservableWhenItemAddedToCart().subscribe((dataCart) => 
		{
			this.number_of_products_in_cart=dataCart.number_of_products_in_cart;
			//console.log(dataCart);
		});//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
  }

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
    //THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
    this.cartArray = localStorage.getItem('cart');
    this.cartArray = (this.cartArray) ? JSON.parse(this.cartArray) : [];
    this.number_of_products_in_cart = this.cartArray.length;
    //THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
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
    //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser
    //_blank: Opens in the InAppBrowser
    //_system: Opens in the system's web browser.
    let target = "_blank";
    const browser = this.inAppBrowser.create(targetUrl,target,options);
    browser.show();
  }
}
