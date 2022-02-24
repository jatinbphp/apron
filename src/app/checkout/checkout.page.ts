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
  public paymentMethodID:string ='';
  public paymentMethod:string ='';
  public paymentStatus:string = '';
  public objBilling:any=[];
  public objShipping:any=[];
  public shippingObj:any=[];
  public objCoupan:any=[];
  public objCoupanArray:any=[];

  public userArray:any=[]; 
  public resultData:any=[];
  public resultUserData:any=[];
  public resultUserBillingData:any=[];
  public resultUserShippingData:any=[];
  public userProvince:string='';
  public passwordType: string = 'password';
	public passwordIcon: string = 'eye-off';

  public loginForm = this.fb.group({
		username: ['', Validators.required],
		password: ['', Validators.required]
	});

  public couponForm = this.fb.group({
		coupon_code: ['', Validators.required]
	});

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
    payment_method: ['', Validators.required], 
    shipping_method: [''],
    username: [''],
    password: [''],
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
    this.paymentMethodID = '';
    this.paymentMethod = '';
    this.paymentStatus = '';
    this.userArray=[];
    
    this.userArray = localStorage.getItem('user');
    this.userArray = (this.userArray) ? JSON.parse(this.userArray) : [];
    if(this.userArray['user_id'] > 0)
    {
      await this.sendRequest.getUserDetailByID(this.userArray['user_id']).then(resultUserData => 
      {
        this.resultUserData = resultUserData;
        if(this.resultUserData.length > 0)
        {
          this.resultUserBillingData = this.resultUserData['billing'];
          this.resultUserShippingData = this.resultUserData['shipping'];
    
          let first_name = (this.resultUserBillingData['first_name']) ? this.resultUserBillingData['first_name'] : this.resultUserData['first_name'];
          let last_name = (this.resultUserBillingData['last_name']) ? this.resultUserBillingData['last_name'] : this.resultUserData['last_name'];
          let address = (this.resultUserBillingData['address_1']) ? this.resultUserBillingData['address_1'] : "";
          let city = (this.resultUserBillingData['city']) ? this.resultUserBillingData['city'] : "";        
          let state = (this.resultUserBillingData['state']) ? this.resultUserBillingData['state'] : "GP";        
          let phone = (this.resultUserBillingData['phone']) ? this.resultUserBillingData['phone'] : "";
          let postcode = (this.resultUserBillingData['postcode']) ? this.resultUserBillingData['postcode'] : "";
          let email = (this.resultUserData['email']) ? this.resultUserData['email'] : "";
          this.userProvince=state;
          //BILLING INFORMATION
          this.checkoutForm.controls['billing_first_name'].setValue(first_name);
          this.checkoutForm.controls['billing_last_name'].setValue(last_name);
          this.checkoutForm.controls['billing_address'].setValue(address);
          this.checkoutForm.controls['billing_city'].setValue(city);
          this.checkoutForm.controls['billing_province'].setValue(state);
          this.checkoutForm.controls['billing_phone'].setValue(phone);        
          this.checkoutForm.controls['billing_zipcode'].setValue(postcode);
          this.checkoutForm.controls['billing_email'].setValue(email);

          this.checkoutForm.controls['username'].setValue("");
          this.checkoutForm.get('username').clearValidators();     
          this.checkoutForm.get('username').updateValueAndValidity();
          this.checkoutForm.controls['password'].setValue("");
          this.checkoutForm.get('password').clearValidators();     
          this.checkoutForm.get('password').updateValueAndValidity();
        }
      });
    }
    else 
    {
      this.checkoutForm.get('username').setValidators([Validators.required]);     
      this.checkoutForm.get('username').updateValueAndValidity();
      this.checkoutForm.get('password').setValidators([Validators.required]);     
      this.checkoutForm.get('password').updateValueAndValidity();
    }
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

  hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    	this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

  async makeMeLoggedin(form)
	{
		//LOADER
		const loading = await this.loadingCtrl.create({
			spinner: null,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER
		let data={
			username:form.username, 
			password:form.password
		}
		await this.sendRequest.makeMeLoggedin(data).then(result => 
		{	
      this.sendRequest.publishSomeDataWhenLogin({
				is_user_login: true
			});//THIS OBSERVABLE IS USED TO GET SCREEN LOAD FROM ION WILL ENTER
      this.sendRequest.showMessage("You are successfully logged in");
      loading.dismiss();//DISMISS LOADER		
			this.resultData=result;
      console.log(this.resultData);
			let objectUser={
				user_id:this.resultData['data']['ID'],
				display_name:this.resultData['data']['display_name'],
				user_email:this.resultData['data']['user_email'],
			}
			localStorage.setItem('user',JSON.stringify(objectUser));
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});	

    await this.sendRequest.getUserDetailByID(this.resultData['data']['ID']).then(resultUserData => 
    {
      this.resultUserData = resultUserData;
      if(this.resultUserData.length > 0)
      {
        this.resultUserBillingData = this.resultUserData['billing'];
        this.resultUserShippingData = this.resultUserData['shipping'];

        let first_name = (this.resultUserBillingData['first_name']) ? this.resultUserBillingData['first_name'] : this.resultUserData['first_name'];
        let last_name = (this.resultUserBillingData['last_name']) ? this.resultUserBillingData['last_name'] : this.resultUserData['last_name'];
        let address = (this.resultUserBillingData['address_1']) ? this.resultUserBillingData['address_1'] : "";
        let city = (this.resultUserBillingData['city']) ? this.resultUserBillingData['city'] : "";        
        let state = (this.resultUserBillingData['state']) ? this.resultUserBillingData['state'] : "GP";        
        let phone = (this.resultUserBillingData['phone']) ? this.resultUserBillingData['phone'] : "";
        let postcode = (this.resultUserBillingData['postcode']) ? this.resultUserBillingData['postcode'] : "";
        let email = (this.resultUserData['email']) ? this.resultUserData['email'] : "";
        this.userProvince=state;
        //BILLING INFORMATION
        this.checkoutForm.controls['billing_first_name'].setValue(first_name);
        this.checkoutForm.controls['billing_last_name'].setValue(last_name);
        this.checkoutForm.controls['billing_address'].setValue(address);
        this.checkoutForm.controls['billing_city'].setValue(city);
        this.checkoutForm.controls['billing_province'].setValue(state);
        this.checkoutForm.controls['billing_phone'].setValue(phone);        
        this.checkoutForm.controls['billing_zipcode'].setValue(postcode);
        this.checkoutForm.controls['billing_email'].setValue(email);

        this.checkoutForm.controls['username'].setValue("");
        this.checkoutForm.get('username').clearValidators();     
        this.checkoutForm.get('username').updateValueAndValidity();
        this.checkoutForm.controls['password'].setValue("");
        this.checkoutForm.get('password').clearValidators();     
        this.checkoutForm.get('password').updateValueAndValidity();
      }
      else 
      {
        this.checkoutForm.get('username').setValidators([Validators.required]);     
        this.checkoutForm.get('username').updateValueAndValidity();
        this.checkoutForm.get('password').setValidators([Validators.required]);     
        this.checkoutForm.get('password').updateValueAndValidity();
      }
    });	
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

  async PlaceOrder(form)
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
    //LOADER
    
    let payment_method = (form.payment_method) ? form.payment_method : "";
    let is_alternative_product_allow = (form.is_alternative_product_allow) ? form.is_alternative_product_allow : "";
    //BILLING DETAIL
    let billing_delivery_location = (form.billing_delivery_location) ? form.billing_delivery_location : "";    
    let billing_first_name = (form.billing_first_name) ? form.billing_first_name : "";
    let billing_last_name = (form.billing_last_name) ? form.billing_last_name : "";
    let billing_address = (form.billing_address) ? form.billing_address : "";
    let billing_city = (form.billing_city) ? form.billing_city : "";
    let billing_province = (form.billing_province) ? form.billing_province : "";
    let billing_zipcode = (form.billing_zipcode) ? String(form.billing_zipcode) : "";
    let billing_phone = (form.billing_phone) ? form.billing_phone : "";
    let billing_email = (form.billing_email) ? form.billing_email : "";
    //SHIPPING DETAIL
    let shipping_first_name = (form.shipping_first_name) ? form.shipping_first_name : "";
    let shipping_last_name = (form.shipping_last_name) ? form.shipping_last_name : "";
    let shipping_address = (form.shipping_address) ? form.shipping_address : "";
    let shipping_city = (form.shipping_city) ? form.shipping_city : "";
    let shipping_province = (form.shipping_province) ? form.shipping_province : "";
    let shipping_zipcode = (form.shipping_zipcode) ? String(form.shipping_zipcode) : "";
    let shipping_phone = (form.shipping_phone) ? form.shipping_phone : "";
    let shipping_email = (form.shipping_email) ? form.shipping_email : "";

    if(payment_method == "netcash")
    {
      this.paymentMethodID="netcash";
      this.paymentMethod="Secure online Payments via Netcash";
      this.paymentStatus="processing";
    }
    if(payment_method == "transactionjunction")
    {
      this.paymentMethodID="transactionjunction";
      this.paymentMethod="Transaction Junction";
      this.paymentStatus="processing";
    }

    if(this.shippint_to_different_address == false)
    {
      this.objBilling = 
      {
        first_name: billing_first_name,
        last_name: billing_last_name,
        address_1: billing_address,
        address_2: "",
        city: billing_city,
        state: billing_province,
        postcode: billing_zipcode,
        country: "ZA",
        email: billing_email,
        phone: billing_phone
      }

      this.objShipping = 
      {
        first_name: billing_first_name,
        last_name: billing_last_name,
        address_1: billing_address,
        address_2: "",
        city: billing_city,
        state: billing_province,
        postcode: billing_zipcode,
        country: "ZA",
        email: billing_email,
        phone: billing_phone        
      }
    }//DELIVERY TO SAME ADDRESS
    else 
    {
      this.objBilling = 
      {
        first_name: billing_first_name,
        last_name: billing_last_name,
        address_1: billing_address,
        address_2: "",
        city: billing_city,
        state: billing_province,
        postcode: billing_zipcode,
        country: "ZA",
        email: billing_email,
        phone: billing_phone
      }

      this.objShipping = 
      {
        first_name: shipping_first_name,
        last_name: shipping_last_name,
        address_1: shipping_address,
        address_2: "",
        city: shipping_city,
        state: shipping_province,
        postcode: shipping_zipcode,
        country: "ZA",
        email: shipping_email,
        phone: shipping_phone        
      }
    }//DELIVERY TO DIFFERENT ADDRESS
    this.shippingObj = [];
  }

  async applyCoupon(form)
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
    //LOADER
    
    let couponCode = form.coupon_code;
    await this.sendRequest.validateCoupon(couponCode).then(result => 
    {	
      this.objCoupan=result;
      if(this.objCoupan.length > 0)
      {
        loading.dismiss();//DISMISS LOADER
        let objApplyCoupon = 
        {          
          'code':this.objCoupan[0]['code'],
          //'id':this.objCoupan[0]['id'],            
          'discount':this.objCoupan[0]['amount'],            
          'meta_data':this.objCoupan[0]['meta_data'],          
        }
        this.objCoupanArray.push(objApplyCoupon);
      } 
      else 
      {
        loading.dismiss();//DISMISS LOADER
        this.sendRequest.showMessage("Invalid coupon code!");
      }   
      //console.log(this.objCoupan);
      //console.log(this.objCoupan.length);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }
}
