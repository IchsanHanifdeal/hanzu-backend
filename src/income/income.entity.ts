import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Event } from 'src/event/event.entity';

@Table({
    tableName: 'income'
})
export class Income extends Model<Income>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @ForeignKey(() => Event)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'event_id'
    })
    eventId: number;

    @Column({
        type: DataType.BIGINT,
        allowNull: false
    })
    jumlah: number;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    tanggal: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'created_at'
    })
    createdAt: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'updated_at'
    })
    updatedAt: string;

    @BelongsTo(() => Event, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    })
    event: Event;
}
