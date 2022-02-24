import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SendReceiveRequestsService 
{
	private api_url: string = "https://apronbutchery.co.za/";
	private consumer_key: string = "ck_38159960886c25bf6647cdd36250e9a5cfedb219";
	private consumer_secret: string = "cs_a175de908615e35f4a561032c434688ad756de36";
	private token: string;

	private fooSubjectWhenItemAddedToCart = new Subject<any>();//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER
	public fooSubjectWhenlOGIN = new Subject<any>();//THIS OBSERVABLE IS USED TO CHECK USER LOGIN

	constructor(private http: HttpClient, private alertCtrl: AlertController, public router: Router)
	{ }

  	getHeaderOptions(): any 
	{	
		var headers=new HttpHeaders().set('Content-Type','application/json');
		return { headers }		
	}

	getNonce()
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("controller",'user').set("method", 'register').set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret); //Create new HttpParams
			this.http.get(this.api_url + "api/get_nonce", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	publishSomeDataWhenItemAddedToCart(data: any) {
        this.fooSubjectWhenItemAddedToCart.next(data);
    }//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER

	getObservableWhenItemAddedToCart(): Subject<any> {
        return this.fooSubjectWhenItemAddedToCart;
	}//THIS OBSERVABLE IS USED TO SHOW QUANTITY ON HEADER

	publishSomeDataWhenLogin(data: any) {
        this.fooSubjectWhenlOGIN.next(data);
    }//THIS OBSERVABLE IS USED TO CHECK USER LOGIN

    getObservableWhenLogin(): Subject<any> {
        return this.fooSubjectWhenlOGIN;
	}//THIS OBSERVABLE IS USED TO CHECK USER LOGIN

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

	getProductDetailByID(data)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products/"+data.product_id, { headers: headers, params: params }).subscribe((res: any) => 
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

	getRelatedProductDetailByID(data)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("include", data).set("per_page", '100').set("page", '1').set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products", { headers: headers, params: params }).subscribe((res: any) => 
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

	getSearchedProducts(data)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("search",data.search_text).set("category",data.search_category).set("force",'true').set("orderby",data.sort_by).set("order",data.order_by).set("status","publish").set("per_page", '100').set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);						
			this.http.get(this.api_url + "wp-json/apronbutchery-api-search-products/products", { headers: headers, params: params }).subscribe((res: any) => 
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

	getProductVariations(productID)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("orderby",'menu_order').set("order",'asc').set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products/"+productID+"/variations", { headers: headers, params: params }).subscribe((res: any) => 
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

  	async showMessage(message)
	{	
		const alert = await this.alertCtrl.create(
		{
		//header: 'THE APRON',
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

	register(data,nonce)
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("username",data.username).set("email", data.email).set("user_pass", data.cpassword).set("nonce", nonce).set("display_name", data.username); //Create new HttpParams
			this.http.get(this.api_url + "api/user/register/", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	makeMeLoggedin(option:any)
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("username",option.username).set("password", option.password); //Create new HttpParams
			this.http.get(this.api_url + "wp-json/apronbutchery-api-login/login", { headers: headers, params: params }).subscribe((res: any) => 
			{
				//console.log(res);
				if(res.data==undefined) 
				{
					this.showMessage(res.message);
					reject(res);
				} 
				else 
				{
					resolve(res);
				}
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	getCheckoutAlternatives()
	{	
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "wp-json/apronbutchery-api-checkout/fields/").subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	getUserDetailByID(user_id)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/customers/"+user_id, { headers: headers, params: params }).subscribe((res: any) => 
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

	validateCoupon(couponCode)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();

			let params = new HttpParams().set("code", couponCode).set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/coupons/", { headers: headers, params: params }).subscribe((res: any) => 
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
	}//REFERENCE::http://www.domainname.com/wp-json/wc/v3/coupons/?code=your_coupon_code

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
