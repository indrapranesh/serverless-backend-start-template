import { Table, PrimaryKey, AutoIncrement, Column, DataType, Model, ForeignKey} from "sequelize-typescript";
import { Event } from "./event.model";
import { User } from "./user.model";

@Table({
    tableName: 'ParticipantStatus',
    modelName: 'ParticipantStatus'
})
export class ParticipantStatus extends Model<ParticipantStatus> {
    
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column(DataType.STRING)
    status: string;
}


@Table({
    tableName: 'Participant',
    modelName: 'Participant'
})
export class Participant extends Model<Participant> {
    
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId: number;

    @ForeignKey(() => Event)
    @Column(DataType.INTEGER)
    eventId: number;

    @ForeignKey(() => ParticipantStatus)
    @Column(DataType.INTEGER)
    status: number;
    
    @Column(DataType.DATE)
    createdAt: Date;

    @Column(DataType.DATE)
    updatedAt: Date;
}