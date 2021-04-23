import { Table, PrimaryKey, AutoIncrement, Column, DataType, Model, ForeignKey} from "sequelize-typescript";
import { User } from "./user.model";

@Table({
    tableName: 'EventType',
    modelName: 'EventType'
})
export class EventType extends Model<EventType> {
    
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column(DataType.STRING)
    type: string;
}


@Table({
    tableName: 'Event',
    modelName: 'Event'
})
export class Event extends Model<Event> {
    
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => EventType)
    @Column(DataType.INTEGER)
    eventType: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    creator: number;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.STRING)
    address: string;

    @Column(DataType.STRING)
    zipcode: string;

    @Column(DataType.STRING)
    latitude: string;

    @Column(DataType.STRING)
    longitude: string;
    
    @Column(DataType.DATE)
    createdAt: Date;

    @Column(DataType.DATE)
    updatedAt: Date;
}