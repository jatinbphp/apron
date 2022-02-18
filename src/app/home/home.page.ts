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

  constructor(private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController)
  { }

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
      //console.log(this.allPopularProducts);
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
}
