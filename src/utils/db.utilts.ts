import { Session } from "../namespaces/session.namespace";
import { Sequelize } from "sequelize-typescript";
import { SESSION_VARIABLES } from "../constants/aws.constants";
import { Logger } from '../utils/logger.utils';
import { Transaction } from "sequelize";


export const getTransaction = (parentTransaction?: Transaction): Promise<Transaction> => {
    Logger.info('Entering into <getTransaction>')
    return new Promise<Transaction>(async (resolve, reject) => {
        try {
            const sequelize = getSequelize();
            let trans;
            if (parentTransaction) {
                trans = await sequelize.transaction({
                    autocommit: false,
                    transaction: parentTransaction
                });
            } else {
                trans = await sequelize.transaction({
                    autocommit: false
                });
            }
            Logger.info('Resolving promise from <getTransaction>')
            resolve(trans);
        } catch (error) {
            Logger.info('Rejecting promise from <getTransaction>')
            Logger.error(error);
            reject(error);
        }
    });
}

export const getSequelize = (): Sequelize => {
    const sequelize = Session.getValue<Sequelize>(SESSION_VARIABLES.SEQUELIZE);
    return sequelize;
}
