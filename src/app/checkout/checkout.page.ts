import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit 
{
  public nonce:string='';
  public cartArray:any=[];
  public cartOrderArray:any=[];
  public objOrderArray:any=[];
  public objDeliveryLocationsArray:any=[];
  public objAlternativesArray:any=[];
  public objProvinceArray:any=[];
  public shippint_to_different_address:boolean=false;
  public checkout_top_note:any='';
  public selectedAreaOfDelivery: string = '';
  public shippingAmount:string='';
  public cart_total_with_delivery_area: any = '';
  public cart_total: any = '';

  public checkoutForm = this.fb.group({
    billing_delivery_location: ['', Validators.required],
    billing_first_name: ['', Validators.required],
    billing_last_name: ['', Validators.required],
    billing_address: ['', Validators.required],
    billing_city: ['', Validators.required],
    billing_province: ['', Validators.required],
    billing_zipcode: ['', Validators.required],
    billing_phone: ['', Validators.required],
    billing_email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    billing_order_notes: [''],  
    shipping_first_name: [''], 
    shipping_last_name: [''],  
    shipping_address: [''],  
    shipping_city: [''],  
    shipping_province: [''],  
    shipping_zipcode: [''],  
    shipping_phone: [''],  
    shipping_email: [''],
    coupon_code: [''],
    payment_method: ['', Validators.required], 
    shipping_method: [''],
  });
  constructor(private fb: FormBuilder, private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter() 
	{
    this.objOrderArray = [];
    this.objDeliveryLocationsArray = [];
    this.objAlternativesArray=[];
    this.objProvinceArray=[];
    this.shippingAmount ='';
    this.cart_total='';
    /*
		await this.sendRequest.getNonce().then((response:any) => 
		{	console.log(response);
			this.nonce=response.nonce;
		},
		error => 
		{});
    */
    await this.sendRequest.getCheckoutAlternatives().then(resultAlternative => 
    {	
      if(resultAlternative['additional_field'].length > 0)
      {
        this.objAlternativesArray=resultAlternative['additional_field']['additional_wooccm1']['options'];
      }
      this.objDeliveryLocationsArray=resultAlternative['delivery_location']['options'];
      this.objProvinceArray=resultAlternative['state_list'];
      this.checkout_top_note=resultAlternative['checkout_top_note'];
    },
    error => 
    {
      console.log();
    });//CHECKOUT ALTERNATIVES,DELIVERY LOCATION,PROVINCE
    console.log(this.objProvinceArray);
    this.cartArray = JSON.parse(localStorage.getItem('cart'));
    if(this.cartArray!=null && this.cartArray.length > 0)
    {
      for(let c=0;c<this.cartArray.length;c++)
      {
        let product_id = this.cartArray[c].product_id;
        let product_qt = this.cartArray[c].product_qt;
        let product_vr = (this.cartArray[c].product_vr) ? this.cartArray[c].product_vr : 0;
        if(product_vr > 0)
        {
          let objForCart = 
          {
            product_id : product_id,
            quantity: product_qt,
            variation_id:product_vr
          }
          this.cartOrderArray.push(objForCart);
        }
        else
        {
          let objForCart = 
          {
            product_id : product_id,
            quantity: product_qt
          }
          this.cartOrderArray.push(objForCart);
        }
        this.cart_total+=this.cartArray[c].product_pr;
      }
    }
  }

  show_hide_shipping()
  {
    this.shippint_to_different_address != this.shippint_to_different_address;
    if(this.shippint_to_different_address == true)
    {
      this.checkoutForm.controls['shipping_first_name'].setValue("");
      this.checkoutForm.controls['shipping_last_name'].setValue("");
      this.checkoutForm.controls['shipping_address'].setValue("");
      this.checkoutForm.controls['shipping_city'].setValue("");
      this.checkoutForm.controls['shipping_province'].setValue("");
      this.checkoutForm.controls['shipping_zipcode'].setValue("");
      this.checkoutForm.controls['shipping_phone'].setValue("");
      this.checkoutForm.controls['shipping_email'].setValue("");
    }    
  }

  selectedDeliveryLocation(ev)
  {
    this.selectedAreaOfDelivery = ev.detail.value;
    if(this.selectedAreaOfDelivery == "Outside Midstream Estate")
    {
      this.shippingAmount = "60";//TO MAKE SHIPPING FREE MAKE VALUE 0 HERE
    }
    else
    {
      this.shippingAmount = "30";//TO MAKE SHIPPING FREE MAKE VALUE 0 HERE
    }
    this.cart_total_with_delivery_area = Number(this.cart_total) + Number(this.shippingAmount);
    console.log(this.cart_total_with_delivery_area);
  }
}
