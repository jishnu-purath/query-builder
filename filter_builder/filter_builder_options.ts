// interfaces
interface FieldOptions {
    $eq?: string;
    $ne?: string;
    $in?: string;
    $nin?: string;
    $lt?: string;
    $lte?: string;
    $gt?: string;
    $gte?: string;
    $regex?: string;
}

export interface Field {
    [key: string]: FieldOptions;
}

export type Where = {
    [K in Operator]?: (Where | Field)[];
};

// enum
export enum Operator {
    AND = "$and",
    OR = "$or",
}
