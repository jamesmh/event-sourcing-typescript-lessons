import { Meta, PurchaseMade } from '../types'

export class AvgCostProjection {
    private _prices: Array<number> = [];

    public get Avg() : number {
        const sum = this._prices.reduce(
            (a:number, b:number) => a + b, 0
        );

        if(sum > 0) {
            return sum / this._prices.length;
        } else {
            return 0;
        }
    }

    apply(events: Meta[]){
        for(const meta of events) {
            switch(meta.Type) {
                case PurchaseMade.TypeName:
                    const e = meta.Event as PurchaseMade;
                    this._prices.push(e.Amount);
                    break;
            }
        }
    }
}