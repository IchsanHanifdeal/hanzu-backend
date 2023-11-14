import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { EventStatus } from 'src/general/event-status.type';
import { Income } from 'src/income/income.entity';

@Table({
    tableName: 'event'
})
export class Event extends Model<Event>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column({
        type: new DataType.STRING(25),
        allowNull: false
    })
    nama: string;

    @Column({
        type: DataType.TEXT('long'),
        allowNull: false
    })
    deskripsi: string;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false
    })
    nagari: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
        field: 'tanggal_mulai'
    })
    tanggalMulai: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
        field: 'tanggal_selesai'
    })
    tanggalSelesai: string;

    @Column({
        type: DataType.ENUM(EventStatus.Belum, EventStatus.Berlangsung, EventStatus.Selesai),
        allowNull: false
    })
    status: EventStatus;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false
    })
    gambar: string;

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

    @HasMany(() => Income)
    income: Income[];
}
