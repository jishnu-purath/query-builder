import { createConnection, getRepository } from "typeorm";
import { BuyerModel } from "./entities/buyer";
import { FilterBuilder } from "./filter_builder/filter_builder";

(async () => {
    try {
        const connection = await createConnection({
            type: "mssql",
            host: "localhost",
            port: 1433,
            username: "buyer_sql_user",
            password: "vTeexZdmcNVD5ZDyvDdQ",
            database: "sale-registration",
            entities: [BuyerModel],
            options: {
                encrypt: false,
            },
        });
        const filterBuilder = new FilterBuilder();
        console.log("Building");
        const qb = getRepository(BuyerModel).createQueryBuilder();
        const where = {
            $and: [
                {
                    participationStatusName: {
                        $lte: "123",
                        $gte: "123",
                    },
                },
                {
                    $or: [
                        {
                            "buyer.buyerId": { $eq: "864506BC-C845-4D68-89E5-B066C297F6F7" },
                        },
                        { "client.clientNumber": { $eq: "0A123" } },
                    ],
                },
                {
                    "client.phone": "1234",
                },
            ],
        } as any;

        const q = filterBuilder.filterQuery<BuyerModel>(qb, where);
        console.log(q.getSql());
    } catch (error) {
        console.error(error);
    }
})();
