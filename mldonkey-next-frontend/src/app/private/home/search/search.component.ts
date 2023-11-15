import { Component, OnInit } from '@angular/core'
import { interval } from 'rxjs'
import { WebSocketService } from 'src/app/websocket-service.service'
import {
    MLMsgToGetSearch,
    MLMsgToQuery
} from 'src/app/msg/MLMsgQuery'
import { SearchesService } from 'src/app/services/searches.service'
    
@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    i = 3

    constructor(private websocketService: WebSocketService, private searchService: SearchesService) {}

    ngOnInit(): void {
        interval(1000).subscribe(() => {
            //this.websocketService.sendMsg(new MLMsgToGetSearches())
            console.log("Request")
            this.websocketService.sendMsg(new MLMsgToQuery(this.i))
            this.websocketService.sendMsg(new MLMsgToGetSearch(this.i++))
            //this.websocketService.sendMsg(new MLMsgToGetSearches())
        })
    }
}
