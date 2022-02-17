import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SendReceiveRequestsService 
{
	private api_url: string = "https://apronbutchery.co.za/";
	private consumer_key: string = "ck_38159960886c25bf6647cdd36250e9a5cfedb219";
	private consumer_secret: string = "cs_a175de908615e35f4a561032c434688ad756de36";
	private token: string;

	constructor(private http: HttpClient, private alertCtrl: AlertController, public router: Router)
	{ }

  	getHeaderOptions(): any 
	{	
		var headers=new HttpHeaders().set('Content-Type','application/json');
		return { headers }		
	}

  	async get_categories_main()
	{
		return new Promise((resolve, reject) => 
		{	
			let headers = this.getHeaderOptions();			
			let params = new HttpParams().set("exclude",'15').set("per_page",'100').set("page", '1').set("parent", '0').set("hide_empty", 'true').set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products/categories", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
			err => 
			{
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getPopularProducts(page,sortBy,orderBy)
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			//.set("stock_status","instock")ADD THIS PARAMETER TO SHOW PRODUCTS WHICH IS IN STOCK ONLY
			let params = new HttpParams().set("orderby",sortBy).set("status","publish").set("order",orderBy).set("per_page",'20').set("page", page).set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products", { observe: 'response', headers: headers, params: params }).subscribe((res: any) => 
			{
				let totalNumberOfPages = res.headers.get('X-WP-TotalPages');
				let dataToReturn = 
				{
					data : res.body,
					totalPages:totalNumberOfPages
				}
				resolve(dataToReturn);
				//resolve(res);
			},
			err => 
			{
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getProductFromCategory(data,sortBy,orderBy)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			//.set("stock_status","instock")ADD THIS PARAMETER TO SHOW PRODUCTS WHICH IS IN STOCK ONLY
			let params = new HttpParams().set("category",data.id).set("orderby",sortBy).set("order",orderBy).set("status","publish").set("per_page", '50').set("page", data.page).set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products", { observe: 'response', headers: headers, params: params }).subscribe((res: any) => 
			{
				let totalNumberOfPages = res.headers.get('X-WP-TotalPages');
				let dataToReturn = 
				{
					data : res.body,
					totalPages:totalNumberOfPages
				}
				resolve(dataToReturn);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

  	async showMessage(message)
	{	
		const alert = await this.alertCtrl.create(
		{
		header: 'DERNAFIES',
		message: message,
		buttons: 
		[
			{
			text: 'Okay',
			handler: () => 
			{
				//console.log('Confirm Cancel: blah');
			}
			}
		]
		});
		await alert.present();		
	}

  	getErrorMessage(err)
	{	
		if(err.error == null)
		{
			return err.message;
		}
		else if(err.error.message)
		{
			return err.error.message;
		} 
		else 
		{
			return err.error.status;
		}
	}
}
