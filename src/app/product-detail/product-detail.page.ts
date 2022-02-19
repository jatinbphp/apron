import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})

export class ProductDetailPage implements OnInit 
{
  public product_to_be_show:any=[];
  public product_id:any=''
  public product_nm:any=''
  public productDetail:any=[];
  public productImages:any=[];
  public relatedProducts: any=[];
  public relatedProductsIDS:any='';

  public ProductVariations: any=[]; 
  public ProductVariationsPrice: number = 0;
  public ProductVariationsOptionSelected: string = '';
  public ProductVariationsPriceToShow: string = '';
  public ProductVariationsSelected: number = 0;
  public IsProductVariationSelected: boolean = false;

  public optionsMainSlider = 
  {
    slidesPerView: 1,
    initialSlide: 1,
    speed: 600,
  };

  public optionsRelatedProductsSlider = 
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

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
    this.ProductVariationsSelected=0;
    this.ProductVariationsPrice=0;
    this.ProductVariationsOptionSelected='';
    this.ProductVariationsPriceToShow='';
    this.IsProductVariationSelected=false;
    //THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
    this.cartArray = localStorage.getItem('cart');
    this.cartArray = (this.cartArray) ? JSON.parse(this.cartArray) : [];
    this.number_of_products_in_cart = this.cartArray.length;
    //THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
    
    this.product_to_be_show = (localStorage.getItem('product_to_be_show')) ? JSON.parse(localStorage.getItem('product_to_be_show')) : null;
    if(this.product_to_be_show != null)
    {
      this.product_id=(this.product_to_be_show['product_id']) ? this.product_to_be_show['product_id'] : 0;  
      this.product_nm=(this.product_to_be_show['product_nm']) ? this.product_to_be_show['product_nm'] : "";
    }
    this.productDetail=[];
    this.productImages=[];
    this.relatedProducts=[];
    this.relatedProductsIDS='';

    await this.sendRequest.getProductVariations(this.product_id).then(result => 
    {
      this.ProductVariations=result;
      if(this.ProductVariations.length == 0)
      {
        this.IsProductVariationSelected = true;
      }
    });
    console.log(this.ProductVariations);

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

    let dataProduct=
    {
      product_id:this.product_id
    }
    await this.sendRequest.getProductDetailByID(dataProduct).then(result => 
    {	
      this.productDetail=result;
      console.log(this.productDetail);
      if(this.productDetail.images.length > 0)
      {
        for(let img = 0; img < this.productDetail.images.length; img ++)
        {
          this.productImages.push(this.productDetail.images[img].src);
        }
        console.log(this.productImages);
      }
      if(this.productDetail.related_ids.length > 0)
      {
        this.relatedProductsIDS=this.productDetail.related_ids.join(",");
      }
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    })//PRODUCT

    if(this.productDetail.related_ids.length > 0)
    {
      await this.sendRequest.getRelatedProductDetailByID(this.relatedProductsIDS).then(resultRelatedProducts => 
      { 
        loading.dismiss();//DISMISS LOADER
        this.relatedProducts=resultRelatedProducts;
        console.log(this.relatedProducts);
      },
      error => 
      {
        loading.dismiss();//DISMISS LOADER			
        console.log();
      });//RELATED PRODUCT
    }
  }

  ProductDetail(product_id,product_nm)
  {
    let objProduct = {
      product_id:product_id,
      product_nm:product_nm
    }
    localStorage.setItem('product_to_be_show',JSON.stringify(objProduct));
    this.ionViewWillEnter();
  }

  selectedVariation(optionSelected)
  {
    console.log(optionSelected);
    let splitOptionSelected=optionSelected.split("#");    
    this.ProductVariationsSelected=Number(splitOptionSelected[0]);
    this.ProductVariationsOptionSelected=splitOptionSelected[1];
    this.ProductVariationsPrice=splitOptionSelected[2];
    this.ProductVariationsPriceToShow="R"+this.ProductVariationsPrice;
    if(Number(this.ProductVariationsPrice) > 0)
    {
      this.IsProductVariationSelected = true;
    }
    else
    {
      this.IsProductVariationSelected = false;
    }
    console.log(this.ProductVariationsPrice);
  }

  UpdateCart(product_id,product_nm,product_pr,product_qt,product_im)
  {
    let product_image = (product_im) ? product_im : "../../assets/images/no-image.png";
    this.cartArray = localStorage.getItem('cart');
    this.cartArray = (this.cartArray) ? JSON.parse(this.cartArray) : [];

    let product_name_to_update = product_nm;
    if(this.ProductVariationsOptionSelected!="")
    {
      product_name_to_update+=" - "+this.ProductVariationsOptionSelected;
    }
    else 
    {
      product_name_to_update = product_nm;
    }

    if(this.cartArray!=null && this.cartArray.length > 0)
    {
      if(this.cartArray.find(v => v.product_id === product_id))
      {
        this.cartArray.find(v => v.product_id === product_id).product_nm = product_name_to_update;
        this.cartArray.find(v => v.product_id === product_id).product_pr = product_pr;
        this.cartArray.find(v => v.product_id === product_id).product_vr = this.ProductVariationsSelected;
        this.messageForCart="Product already is in your cart.";
      }
      else
      {
        let obj = 
        {
          product_id:product_id,
          product_nm:product_name_to_update,
          product_pr:product_pr,
          product_im:product_image,
          product_qt:(product_qt > 0) ? product_qt : 0,
          product_vr:this.ProductVariationsSelected//PRODUCT VARIATION ID
        };            
        this.cartArray.push(obj);
        this.messageForCart="Product added to cart.";
      }
      localStorage.setItem('cart',JSON.stringify(this.cartArray));
      this.sendRequest.showMessage(this.messageForCart);
    }
    else 
    {
      this.cartArray = [];
      let objCart = {
        product_id:product_id,
        product_nm:product_name_to_update,
        product_pr:product_pr,
        product_im:product_image,
        product_qt:(product_qt > 0) ? product_qt : 0,
        product_vr:this.ProductVariationsSelected//PRODUCT VARIATION ID
      };            
      this.cartArray.push(objCart);
      localStorage.setItem('cart',JSON.stringify(this.cartArray));
      this.messageForCart="Product added to cart.";
      this.sendRequest.showMessage(this.messageForCart);
    }

    this.sendRequest.publishSomeDataWhenItemAddedToCart({
      is_cart_has_item_within: true,
      number_of_products_in_cart:this.cartArray.length
    });//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
  }
}
