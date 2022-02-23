import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit 
{
  public is_searched:boolean=false;
  public searched_text:any='';
  public searched_category:any='';
  public categoryMain:any=[];
  public searchResultMain:any=[];
  public sort_by:string='title';
  public sort_by_to_show:string='title';
  public order_by:string='desc';
  public searchForm = this.fb.group({
		search_text: [''],
		search_category: ['']
	});

  public cartArray:any=[];
  public messageForCart:any='';
  public number_of_products_in_cart:number=0;//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER

  constructor(private fb: FormBuilder, private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController)
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

  async ionViewWillEnter()
  {
    //THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
    this.cartArray = localStorage.getItem('cart');
    this.cartArray = (this.cartArray) ? JSON.parse(this.cartArray) : [];
    this.number_of_products_in_cart = this.cartArray.length;
    //THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
  }
  
  async searchAsAsked(form)
  {
    let search_text = (form.search_text) ? form.search_text : "";
    let search_category = (form.search_category) ? form.search_category : 0;
    let split_search_category = search_category.split("#");
    let searched_category_id = split_search_category[0];
    let searched_category_nm = split_search_category[1];
    this.is_searched=true;
    this.searched_text=search_text;
    this.searched_category=searched_category_nm;
    let objSearch = {
      search_text:search_text,
      search_category:searched_category_id,
      sort_by:this.sort_by,
      order_by:this.order_by
    }

    await this.sendRequest.getSearchedProducts(objSearch).then(searchResult => 
    {	
      this.searchResultMain=searchResult['product_data'];
      console.log(this.searchResultMain);						
    },
    error => 
    {
      console.log();
    });//CATEGORIES
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

  ResetSearch()
  {
    this.is_searched=false;
    this.searched_text="";
    this.searched_category=false;
    this.searchResultMain=[];
    this.searchForm.reset();
  }
}
