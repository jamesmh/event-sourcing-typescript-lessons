import { EventStoreService } from './../common/event-store/event-store.service';
import { allPurchasesProjection, Purchase } from './projections/all';
import { CommandBus } from '@nestjs/cqrs';
import { avgCostProjection } from './projections/avg-cost-report';
import { Body, Controller, Get, Post, Redirect } from '@nestjs/common';
import { IsNumberString } from "class-validator";
import { MakePurchaseCommand } from './commands/make-purchase/make-purchase.command';
import { RefundPurchaseCommand } from './commands/refund/refund-purchase.command';

class MakePurchaseRequest {
    @IsNumberString()
    public amount: string;
}

class RefundPurchaseRequest {
    public id: string;
  }

@Controller('purchase')
export class PurchaseController {

    constructor(
        private _commandBus: CommandBus,
        private _store: EventStoreService
    ) { }

    @Get()
    all() {
        const purchases = allPurchasesProjection.Purchases;

        let html = `
        <h1>Existing Purchases:</h1>
        <ul>`;
        for (const p of purchases) {
            html += `
            <li style="${p.WasRefunded ? 'color: red' : ''}">
                <div>Purchase Id: ${p.Id}</div>
                <div>Amount: ${p.Amount}</div>
                <div>At: ${p.At}</div>      
                ${p.WasRefunded ? '<div>Was refunded...</div>' : ''}
                ${renderRefundButton(p)}      
            </li>`;
        };
        html += `</ul>`;

        html+= renderCreatePurchaseForm();

        return html;
    }

    @Get('/raw')
    raw() {
        return this._store.getAll();
    }

    @Get('/report')
    avgPrice() {
        return `
            <h1>Avg Purchase Price</h1>
            <div>$${avgCostProjection.Avg}</div>
        `;
    }

    @Post()
    @Redirect()
    async create(@Body() req: MakePurchaseRequest) {
        await this._commandBus.execute(new MakePurchaseCommand(parseFloat(req.amount))); 
        return {
            url: '/purchase'
        };
    }

    @Post('/refund')
    @Redirect()
    async refund(@Body() req: RefundPurchaseRequest) {    
        await this._commandBus.execute(new RefundPurchaseCommand(req.id));     
        return {
            url: '/purchase'
        };
    }

}

function renderRefundButton(p: Purchase) : string {
    if(p.WasRefunded)
        return '';

    return `
        <form action="/purchase/refund" method="POST">
            <input type="hidden" name="id" value="${p.Id}" />
            <button type="submit">Refund</button>
        </form> 
    `;
}

function renderCreatePurchaseForm() {
    return `
        <h1>Make A Purchase:</h1>
            <form action="/purchase" method="POST">
                <label>Amount</label>
                <input type="number" name="amount" />
                <button type="submit">Create</button>
            </form>        
        `;
}

