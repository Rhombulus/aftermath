/// <reference path="_reference.ts" />

module aftermath.expressions {

    export interface ObservableQueryExpression extends observability.Observable {
        (): expressions.QueryExpression;
        (queryExpression: expressions.QueryExpression): void;
    }


    export class QueryExpression extends Expression {
        

        getFunction(): (entities: any[]) => any[] {

            return entities => this.invoke(entities);
            
        }

        invoke(entities: any[]): any[] {
            throw 'not yet implemented';
        }
        getQueryString(): string {

            throw 'not yet implemented';

        }




        
    }

  


}