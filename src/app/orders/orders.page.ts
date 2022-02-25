import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})

export class OrdersPage implements OnInit 
{
  public queryString: any=[];
  public userArray:any=[];
  public cartArray:any=[];
  public myOrders:any=[];
  public number_of_products_in_cart:number=0;//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
  constructor(private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController)
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

    this.userArray = localStorage.getItem('user');
    this.userArray = (this.userArray) ? JSON.parse(this.userArray) : [];
    if(this.userArray['user_id'] > 0)
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
      
      await this.sendRequest.getAllOrdersByUserID(this.userArray['user_id']).then(result => 
      {	
        loading.dismiss();//DISMISS LOADER		            
        this.myOrders=result;
        console.log(this.myOrders);
      },
      error => 
      {
        loading.dismiss();//DISMISS LOADER			
        console.log();
      })
    }
  }

  OrderDetails(order_id)
  {
    this.queryString = 
    {
      order_id:order_id
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.sendRequest.router.navigate(['/order-detail'], navigationExtras);
  }
}
