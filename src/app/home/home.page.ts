import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit 
{
  public categoryMain:any=[];
  public allPopularProducts:any=[];

  public sort_by:string='popularity';//POPULAR PRODUCTS
  public sort_by_to_show:string='popularity';//POPULAR PRODUCTS
  public order_by:string='desc';//POPULAR PRODUCTS
  public currentPage = 1;//POPULAR PRODUCTS
  public totalNumberOfPages: number = 0;//POPULAR PRODUCTS
  
  public optionsMainSlider = 
  {
    slidesPerView: 1,
    initialSlide: 1,
    speed: 600,
  };

  public optionsPopularProductsSlider = 
  {
    slidesPerView: 2.5,
    initialSlide: 1,
    speed: 600,
  };

  public cartArray:any=[];
  public messageForCart:any='';
  public number_of_products_in_cart:number=0;//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
  
  constructor(private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController)
  { 
    this.sendRequest.getObservableWhenItemAddedToCart().subscribe((dataCart) => 
		{
			this.number_of_products_in_cart=dataCart.number_of_products_in_cart;
			//console.log(dataCart);
		});//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
  }

  async ngOnInit()
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

    await this.sendRequest.get_categories_main().then(result => 
    {	
      this.categoryMain=result;
      //console.log(this.categoryMain);						
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });//CATEGORIES

    await this.sendRequest.getPopularProducts(this.currentPage,this.sort_by,this.order_by).then(result => 
    { 
      loading.dismiss();//DISMISS LOADER
      this.allPopularProducts=result['data'];
      this.totalNumberOfPages=Number(result['totalPages']);
      console.log(this.allPopularProducts);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    })//POPULAR PRODUCTS
  }

  async ionViewWillEnter()
  {
    localStorage.removeItem('category_to_be_show');
    //THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
    this.cartArray = localStorage.getItem('cart');
    this.cartArray = (this.cartArray) ? JSON.parse(this.cartArray) : [];
    this.number_of_products_in_cart = this.cartArray.length;
    //THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
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

  ProductDetail(product_id,product_nm)
  {
    let objProduct = {
      product_id:product_id,
      product_nm:product_nm
    }
    localStorage.setItem('product_to_be_show',JSON.stringify(objProduct));
    this.sendRequest.router.navigate(['/home/product-detail']);
  }

  UpdateCart(product_id,product_nm,product_pr,product_qt,product_im)
  {
    let product_image = (product_im) ? product_im : "../../assets/images/no-image.png";
    this.cartArray = localStorage.getItem('cart');
    this.cartArray = (this.cartArray) ? JSON.parse(this.cartArray) : [];
    if(this.cartArray!=null && this.cartArray.length > 0)
    {
      if(this.cartArray.find(v => v.product_id === product_id))
      {
        this.messageForCart=product_nm+"<br />\nis already in your cart.";
      }
      else
      {
        let obj = 
        {
          product_id:product_id,
          product_nm:product_nm,
          product_pr:product_pr,
          product_im:product_image,
          product_qt:(product_qt > 0) ? product_qt : 0,
          product_vr:''//PRODUCT VARIATION ID
        };            
        this.cartArray.push(obj);
        this.messageForCart=product_nm+"<br />\nis added to cart.";
      }
      localStorage.setItem('cart',JSON.stringify(this.cartArray));
      this.sendRequest.showMessage(this.messageForCart);
    }
    else 
    {
      this.cartArray = [];
      let objCart = {
        product_id:product_id,
        product_nm:product_nm,
        product_pr:product_pr,
        product_im:product_image,
        product_qt:(product_qt > 0) ? product_qt : 0,
        product_vr:''//PRODUCT VARIATION ID
      };            
      this.cartArray.push(objCart);
      localStorage.setItem('cart',JSON.stringify(this.cartArray));
      this.messageForCart=product_nm+"<br />\nis added to cart.";
      this.sendRequest.showMessage(this.messageForCart);
    }

    this.sendRequest.publishSomeDataWhenItemAddedToCart({
      is_cart_has_item_within: true,
      number_of_products_in_cart:this.cartArray.length
    });//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
  }
}
