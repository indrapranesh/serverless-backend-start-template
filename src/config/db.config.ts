import { Sequelize } from "sequelize-typescript";
import { Logger } from "../utils/logger.utils";
import { Session } from "../namespaces/session.namespace";
import { SESSION_VARIABLES } from "../constants/aws.constants";
import { User, UserAddress } from "../models/user.model";
import { ENV_CONSTANTS } from "../constants/env.constants";
import ENVUtils from "../utils/env.utils";
import { Event, EventType } from "../models/event.model";
import { Achievement, UserAchievementMapper } from "../models/achievement.model";
import { Participant, ParticipantStatus } from "../models/participant.model";

export class DbConfig {
    private static sequelize: Sequelize = null;

    constructor() {
    }

    public static async connect() {
        await this.init();
        this.sequelize.authenticate().then(function () {
            Logger.debug('Connection has been established successfully.');
        })
        .catch(function (error) {
            Logger.error('Unable to connect to the database:', error);
        });
    }

    public static async closeConnection() {
        this.sequelize.close();
    }

    public static async init() {
        // let dbSecrets = await DBManager.getSecrets();
        // dbSecrets = JSON.parse(dbSecrets);
        const host = ENVUtils.getEnv(ENV_CONSTANTS.DATABASE_CONFIG.HOST)
        , database = ENVUtils.getEnv(ENV_CONSTANTS.DATABASE_CONFIG.DB_NAME)
        , username = ENVUtils.getEnv(ENV_CONSTANTS.DATABASE_CONFIG.USERNAME)
        , password = ENVUtils.getEnv(ENV_CONSTANTS.DATABASE_CONFIG.PASSWORD)
            , port = 3306

        this.sequelize = new Sequelize({
            database: database,
            password: password,
            dialect: 'mysql',
            username: username,
            port: port,
            host: host,
            benchmark: true,
            dialectOptions: {
                connectTimeout: 25000
            }
        });
        Logger.debug('Entering <init>')
        this.registerModels();
        Session.setValue(SESSION_VARIABLES.SEQUELIZE, this.sequelize);
        Logger.debug('Exiting <init>');
    }

    public static registerModels() {
        Logger.debug('Entering <registerModels>');
        this.sequelize.addModels([
           User,
           UserAddress,
           EventType,
           Event,
           Achievement,
           UserAchievementMapper,
           ParticipantStatus,
           Participant
        ])
    }
}