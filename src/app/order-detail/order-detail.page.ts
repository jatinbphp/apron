import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})

export class OrderDetailPage implements OnInit 
{
  public queryStringData: any= [];
  public order_id: string = "";
  public orderDetails: any=[];
  public shippingDetails: any=[];
  public billingDetails: any=[];
  public creditUsedDetails: any=[];
  public totalCreditUsed:string = '0.00';
  public isOrderHasTax:boolean=false;

  public cartArray:any=[];
  public number_of_products_in_cart:number=0;//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
  constructor(private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController, private route: ActivatedRoute, private router: Router)
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
    
    this.isOrderHasTax=false;
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
    this.totalCreditUsed = '0.00';
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    this.order_id=this.queryStringData['order_id'];

    await this.sendRequest.gerOrderDetailByID(this.order_id).then(result => 
    {	
      //loading.dismiss();//DISMISS LOADER		            
      this.orderDetails=result;
      loading.dismiss();//DISMISS LOADER
      console.log(this.orderDetails);
      this.shippingDetails=this.orderDetails['shipping'];
      this.billingDetails=this.orderDetails['billing']
      if(this.orderDetails['fee_lines'].length > 0)
      {
        this.creditUsedDetails=this.orderDetails['fee_lines'][0];
        if(this.creditUsedDetails.total != null || this.creditUsedDetails.total != "null" || this.creditUsedDetails.total != undefined)
        {
          this.totalCreditUsed = this.creditUsedDetails.total;
        }
      }
      if(this.orderDetails['tax_lines'].length > 0)
      {
        for(let t=0;t<this.orderDetails['tax_lines'].length;t++)
        {
          if(Number(this.orderDetails['tax_lines'][t].tax_total) > 0)
          {
            this.isOrderHasTax=true;
          } 
        }
      }
      console.log(this.creditUsedDetails);
      //console.log(this.shippingDetails);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER			
      console.log();
    });//PRODUCT DETAILS
  }
}
