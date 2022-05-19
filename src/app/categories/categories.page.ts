import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';

@Component({
selector: 'app-categories',
templateUrl: './categories.page.html',
styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit 
{
  public category_to_be_show:any=[];
  public categoryMain:any=[];
  public categoryProducts:any=[];
  public categoryProductsLoadMore:any=[];
  
  public category_id:any='';
  public category_nm:any='';

  public sort_by:string='popularity';
  public sort_by_to_show:string='popularity';
  public order_by:string='desc';

  public sort_by_35:string='id';
  public sort_by_to_show_35:string='id';
  public order_by_35:string='asc';

  public currentPage = 1;
  public totalNumberOfPages: number = 0;

  public optionsCategorySlider = 
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
  { }

  async ionViewWillEnter()
  {
    //THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
    this.cartArray = localStorage.getItem('cart');
    this.cartArray = (this.cartArray) ? JSON.parse(this.cartArray) : [];
    this.number_of_products_in_cart = this.cartArray.length;
    //THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER

    this.category_to_be_show = (localStorage.getItem('category_to_be_show')) ? JSON.parse(localStorage.getItem('category_to_be_show')) : null;
    if(this.category_to_be_show != null)
    {
      this.category_id=(this.category_to_be_show['category_id']) ? this.category_to_be_show['category_id'] : 0;  
      this.category_nm=(this.category_to_be_show['category_nm']) ? this.category_to_be_show['category_nm'] : "";
    }
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
      if(this.categoryMain.length > 0)
      {
        if(this.category_id == 0)
        {
          this.category_id=this.categoryMain[0]['id'];
          this.category_nm=this.categoryMain[0]['name'];
        }
      }
      //console.log(this.categoryMain);						
      //console.log(this.category_id);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });//CATEGORIES

    //this.categoryProducts=[];
    let dataCategoryID=
    {
      id:this.category_id,
      page:this.currentPage 
    }
    if(this.category_id == 35)
    {
      this.sort_by=this.sort_by_35;
      this.order_by=this.order_by_35;
    }
    await this.sendRequest.getProductFromCategory(dataCategoryID,this.sort_by,this.order_by).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.categoryProducts=result['data'];
      this.totalNumberOfPages=Number(result['totalPages']);
      //console.log(this.categoryProducts);
      //console.log(this.totalNumberOfPages);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    })//PRODUCT
  }

  showCategoryProducts(category_id,category_nm)
  {
    this.category_id = category_id;
    this.category_nm = category_nm;
    let objectCategory = {
      category_id:category_id,
      category_nm:category_nm
    }
    localStorage.setItem('category_to_be_show',JSON.stringify(objectCategory));
    this.ionViewWillEnter();
  }

  ProductDetail(product_id,product_nm)
  {
    let objProduct = {
      product_id:product_id,
      product_nm:product_nm
    }
    localStorage.setItem('product_to_be_show',JSON.stringify(objProduct));
    this.sendRequest.router.navigate(['/categories/product-detail']);
  }

  async loadMoreProducts()
  {
    this.currentPage += 1;
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
    let dataCategoryID=
    {
      id:this.category_id,
      page:this.currentPage 
    }
    await this.sendRequest.getProductFromCategory(dataCategoryID,this.sort_by,this.order_by).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.categoryProductsLoadMore=result['data'];
      if(this.categoryProductsLoadMore.length > 0)
      {
        for(let p=0;p<this.categoryProductsLoadMore.length;p++)
        {
          this.categoryProducts.push(this.categoryProductsLoadMore[p]);
        }
      }
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    })//PRODUCT
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
