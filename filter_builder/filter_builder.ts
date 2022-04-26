import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
import { Field, Operator, Where } from "./filter_builder_options";

export class FilterBuilder {
    public filterQuery<T>(query: SelectQueryBuilder<T>, where: Where): SelectQueryBuilder<T> {
        if (!where) {
            return query;
        } else {
            return this.traverseTree(query, where) as SelectQueryBuilder<T>;
        }
    }
    private buildNewBrackets(where: Where, operator: Operator): Brackets {
        return new Brackets((qb) =>
            where[operator]?.map((queryArray: any) => {
                this.traverseTree(qb, queryArray, operator);
            })
        );
    }

    private traverseTree(
        query: WhereExpressionBuilder,
        where: Where | Field,
        upperOperator: Operator = Operator.AND
    ): WhereExpressionBuilder {
        const andOr = upperOperator === Operator.AND ? "andWhere" : "orWhere";
        Object.keys(where).forEach((key) => {
            if (key === Operator.OR) {
                query = query[andOr](this.buildNewBrackets(where, Operator.OR));
            } else if (key === Operator.AND) {
                query = query[andOr](this.buildNewBrackets(where, Operator.AND));
            } else {
                this.handleArgs(query, where as Field, andOr);
                console.log((query as any).expressionMap.wheres);
            }
        });
        return query;
    }

    private handleArgs(query: WhereExpressionBuilder, where: Field, andOr: "andWhere" | "orWhere"): WhereExpressionBuilder {
        const whereArgs = Object.entries(where);

        whereArgs.forEach((whereArg) => {
            const [fieldName, filters] = whereArg;

            if (typeof filters === "object") {
                const ops = Object.entries(filters);
                ops.forEach((parameters) => {
                    const [operation, value] = parameters;
                    // Hope there is no collision
                    const pName = Math.random().toString(36).slice(2);
                    switch (operation) {
                        case "$eq": {
                            if (value === null) {
                                query[andOr](`${fieldName} IS NULL`);
                            } else {
                                query[andOr](`${fieldName} = :${pName}`, { [pName]: value });
                            }
                            break;
                        }
                        case "$ne": {
                            if (value === null) {
                                query[andOr](`${fieldName} IS NOT NULL`);
                            } else {
                                query[andOr](`${fieldName} != :${pName}`, { [pName]: value });
                            }
                            break;
                        }
                        case "$in": {
                            query[andOr](`${fieldName} IN :${pName}`, { [pName]: value });
                            break;
                        }
                        case "$nin": {
                            query[andOr](`${fieldName} NOT IN :${pName}`, {
                                [pName]: value,
                            });
                            break;
                        }
                        case "$lt": {
                            query[andOr](`${fieldName} < :${pName}`, { [pName]: value });
                            break;
                        }
                        case "$lte": {
                            query[andOr](`${fieldName} <= :${pName}`, { [pName]: value });
                            break;
                        }
                        case "$gt": {
                            query[andOr](`${fieldName} > :${pName}`, { [pName]: value });
                            break;
                        }
                        case "$gte": {
                            query[andOr](`${fieldName} >= :${pName}`, { [pName]: value });
                            break;
                        }
                        case "$regex": {
                            query[andOr](`${fieldName} LIKE :${pName}`, {
                                [pName]: `%${value}%`,
                            });
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                });
            } else {
                const pName = Math.random().toString(36).slice(2);
                // the filters is actually the value in this situation
                query[andOr](`${fieldName} = :${pName}`, { [pName]: whereArg[1] });
            }
        });

        return query;
    }
}
