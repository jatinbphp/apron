import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})

export class CartPage implements OnInit 
{
  public cartArray:any=[];
  public cartCalculationArray:any=[]; 
  public cartTotal:number=0;
  public messageForCart='';
  constructor(private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController)
  {}

  ngOnInit()
  {}

  async ionViewWillEnter()
  {
    this.cartArray = localStorage.getItem('cart');
    this.cartArray = (this.cartArray) ? JSON.parse(this.cartArray) : [];
    this.cartTotal = 0;
    this.cartCalculationArray = [];
    if(this.cartArray.length > 0)
    {
      for(let c = 0; c < this.cartArray.length; c ++)
      {
        let product_id = this.cartArray[c].product_id;
        let product_quantity = this.cartArray.find(v => v.product_id === product_id).product_qt;
        let product_price = this.cartArray.find(v => v.product_id === product_id).product_pr;
        let eachProduct = (Number(product_quantity) * Number(product_price));

        this.cartTotal+=Number(product_price)*Number(product_quantity);
        if(this.cartCalculationArray.length > 0 && this.cartCalculationArray.find(v => v.product_id === product_id))
        {
          this.cartCalculationArray.find(v => v.product_id === product_id).product_qt = product_quantity;
          this.cartCalculationArray.find(v => v.product_id === product_id).product_to = eachProduct;
        }
        else 
        {
          let obj = {
            product_id:product_id,
            product_qt:(product_quantity > 0) ? product_quantity : 0,
            product_to:(eachProduct > 0) ? eachProduct : 0
          };            
          this.cartCalculationArray.push(obj);
        }
      }
    }
    console.log(this.cartCalculationArray);
  }

  updateCart(productID,productNM,quantity)
  {
    if(this.cartArray.find(v => v.product_id === productID))
    {
      this.cartArray.find(v => v.product_id === productID).product_qt = quantity;
      this.messageForCart=productNM+" <br />\nquantity updated to cart.";      
    }
    else
    {
      let obj = {
        product_id:productID,
        product_qt:(quantity > 0) ? quantity : 0
      };            
      this.cartArray.push(obj);  
      this.messageForCart="Product added to cart.";    
    }
    localStorage.setItem('cart',JSON.stringify(this.cartArray));
    this.sendRequest.showMessage(this.messageForCart);
    console.log(this.cartCalculationArray);
  }

  increaseQuantity(product)
  {
    if(this.cartArray.length > 0)
    {
      let productID = product.product_id;
      let productNM = product.product_nm;
      if(this.cartArray.find(v => v.product_id === productID))
      {
        let quantity = Number(this.cartArray.find(v => v.product_id === productID).product_qt);
        quantity++;
        this.cartArray.find(v => v.product_id === productID).product_qt = quantity;
        //Each product pricing        
        let product_quantity = this.cartArray.find(v => v.product_id === productID).product_qt;
        let product_price = product.product_pr;
        this.cartTotal+=(1 * Number(product_price));
        let eachProduct = (Number(product_quantity) * Number(product_price));
        
        if(this.cartCalculationArray.find(v => v.product_id === productID))
        {
          this.cartCalculationArray.find(v => v.product_id === productID).product_qt = product_quantity;
          this.cartCalculationArray.find(v => v.product_id === productID).product_to = eachProduct;
        }
        else 
        {
          let obj = {
            product_id:productID,
            product_qt:(product_quantity > 0) ? product_quantity : 0,
            product_to:(eachProduct > 0) ? eachProduct : 0
          };            
          this.cartCalculationArray.push(obj);
        }        
        //Each product pricing
        this.updateCart(productID,productNM,quantity);
      }      
    } 
  }

  decreaseQuantity(product)
  {
    if(this.cartArray.length > 0)
    {
      let productID = product.product_id;
      let productNM = product.product_nm;
      if(this.cartArray.find(v => v.product_id === productID))
      {
        let quantity = Number(this.cartArray.find(v => v.product_id === productID).product_qt);
        if(quantity > 1)
        {
          quantity--;//BEFORE::MIN,MAX QUANTITY RELATED
          this.cartArray.find(v => v.product_id === productID).product_qt = quantity;        
          //Each product pricing        
          let product_quantity = this.cartArray.find(v => v.product_id === productID).product_qt;
          let product_price = product.product_pr;
          this.cartTotal-=(1 * Number(product_price));
          let eachProduct = (Number(product_quantity) * Number(product_price));
          
          if(this.cartCalculationArray.find(v => v.product_id === productID))
          {
            this.cartCalculationArray.find(v => v.product_id === productID).product_qt = product_quantity;
            this.cartCalculationArray.find(v => v.product_id === productID).product_to = eachProduct;
          }
          else 
          {
            let obj = {
              product_id:productID,
              product_qt:(product_quantity > 0) ? product_quantity : 0,
              product_to:(eachProduct > 0) ? eachProduct : 0
            };            
            this.cartCalculationArray.push(obj);
          }   
          if(this.cartTotal <= 0) 
          {
            this.cartTotal=0; 
          }     
          //Each product pricing

          this.updateCart(productID,productNM,quantity);
        }
      }            
    }
  }

  async removeFromCart(product_id, product_pr)
  {
    this.cartArray.some(function(item, index)
    {
      if(this.cartArray[index].product_id === product_id)
      { 
        this.cartArray.splice(index, 1);
      }
    },this);


    this.cartArray.some(function(item, index)
    {
      if(this.cartArray[index].product_id === product_id)
      {
        this.cartArray.splice(index, 1);
      }
    },this);    
    
    this.cartCalculationArray.some(function(item, index)
    {
      if(this.cartCalculationArray[index].product_id === product_id)
      {
        this.cartCalculationArray.splice(index, 1);
      }
    },this);        
    
    this.cartTotal -= product_pr;

    if(this.cartArray.length == 0)
    {
      this.cartTotal = 0;
      this.sendRequest.publishSomeDataWhenItemAddedToCart({
        is_cart_has_item_within: false
      });//THIS OBSERVABLE IS USED TO SHOW RED DOT ON CART MENU      
    }
    localStorage.setItem('cart',JSON.stringify(this.cartArray));  
    this.sendRequest.showMessage("Product removed from cart.");  
    this.ionViewWillEnter();
  }
}
