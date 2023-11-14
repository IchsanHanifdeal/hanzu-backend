
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'konfigurasi',
    timestamps: true
})
export class Konfigurasi extends Model<Konfigurasi> {
    @Column({
        type: new DataType.STRING(191),
        primaryKey: true
    })
    nama: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
        field: 'nilai'
    })
    nilai: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'created_at'
    })
    createdAt: string

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'updated_at'
    })
    updatedAt: string
}
