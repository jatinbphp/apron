import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';

@Component({
  selector: 'app-categories-main',
  templateUrl: './categories-main.page.html',
  styleUrls: ['./categories-main.page.scss'],
})

export class CategoriesMainPage implements OnInit 
{
  public categoryMain:any=[];
  public cartArray:any=[];
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
    await this.sendRequest.get_categories_main().then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.categoryMain=result;      
      //console.log(this.categoryMain);						
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });//CATEGORIES
  }

  categoryProducts(category_id,category_nm)
  {
    let objectCategory = 
    {
      category_id:category_id,
      category_nm:category_nm
    };
    localStorage.setItem('category_to_be_show',JSON.stringify(objectCategory));
    this.sendRequest.router.navigate(['/categories']);
  }
}
