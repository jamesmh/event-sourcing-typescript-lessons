import { AvgCostProjection } from './projections/avg-cost-report';
import { Body, Controller, Delete, Get, Post, Redirect, Req } from '@nestjs/common';
import { AllPurchasesProjection, Purchase } from './projections/all';
import { EventStore, PurchaseMade, PurchaseRefunded } from './types'
import { v4 as createUuid } from 'uuid';

// For sample purposes, a static event store.
const store = new EventStore();

class CreatePurchaseRequest {
    public amount: string;
}

class RefundPurchaseRequest {
    public id: string;
}

@Controller('purchase')
export class PurchaseController {
    @Get()
    all() {
        const projection = new AllPurchasesProjection();
        projection.apply(store.getAll());
        const purchases = projection.Purchases;

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

    @Get('/report')
    avgPrice() {
        const projection = new AvgCostProjection();
        projection.apply(store.getAll());
        const avg = projection.Avg;

        return `
            <h1>Avg Purchase Price</h1>
            <div>$${avg}</div>
        `;
    }

    @Post()
    @Redirect()
    create(@Body() req: CreatePurchaseRequest) {
        const evt: PurchaseMade = new PurchaseMade(createUuid(), parseInt(req.amount));
        store.append(evt.PurchaseId, evt, PurchaseMade.TypeName);
        return {
            url: '/purchase'
        };
    }

    @Post('/refund')
    @Redirect()
    refund(@Body() req: RefundPurchaseRequest) {
        // Notice, that instead of "UPDATE" 'ing a table row we
        // append a new event to the ledger!

        const evt: PurchaseRefunded = new PurchaseRefunded(req.id);
        store.append(evt.PurchaseId, evt, PurchaseRefunded.TypeName);
        
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

