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
  public categoryMain:any=[];
  public searchResultMain:any=[];
  public sort_by:string='title';
  public sort_by_to_show:string='title';
  public order_by:string='desc';
  public searchForm = this.fb.group({
		search_text: [''],
		search_category: ['']
	});
  constructor(private fb: FormBuilder, private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController)
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

  async searchAsAsked(form)
  {
    let search_text = (form.search_text) ? form.search_text : "";
    let search_category = (form.search_category) ? form.search_category : 0;
    this.is_searched=true;
    let objSearch = {
      search_text:search_text,
      search_category:search_category,
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
}
