import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit 
{
  public categoryMain:any=[];
  constructor(private sendRequest: SendReceiveRequestsService, private loadingCtrl: LoadingController)
  { }

  async ngOnInit()
  { 
    await this.sendRequest.get_categories_main().then(result => 
    {	
      this.categoryMain=result;
      console.log(this.categoryMain);						
    },
    error => 
    {
      console.log();
    });//CATEGORIES
  }

}
