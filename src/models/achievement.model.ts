import { Table, PrimaryKey, AutoIncrement, Column, DataType, Model, ForeignKey} from "sequelize-typescript";
import { User } from "./user.model";

@Table({
    tableName: 'Achievement',
    modelName: 'Achievement'
})
export class Achievement extends Model<Achievement> {
    
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column(DataType.STRING)
    name: string;
    
    @Column(DataType.INTEGER)
    level: number;

    @Column(DataType.STRING)
    logoUrl: string;
}


@Table({
    tableName: 'UserAchievementMapper',
    modelName: 'UserAchievementMapper'
})
export class UserAchievementMapper extends Model<UserAchievementMapper> {
    
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Achievement)
    @Column(DataType.INTEGER)
    achievementId: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId: number;
    
    @Column(DataType.DATE)
    createdAt: Date;

    @Column(DataType.DATE)
    updatedAt: Date;
}