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

  constructor(private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
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
      console.log();
    })//PRODUCT

    if(this.productDetail.related_ids.length > 0)
    {
      await this.sendRequest.getRelatedProductDetailByID(this.relatedProductsIDS).then(resultRelatedProducts => 
      { 
        this.relatedProducts=resultRelatedProducts;
        console.log(this.relatedProducts);
      },
      error => 
      {
        //loading.dismiss();//DISMISS LOADER			
        console.log();
      });//RELATED PRODUCT
    }
  }
}
