
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { RoleType } from 'src/general/role.type';

@Table({
    tableName: 'user'
})
export class Auth extends Model<Auth>  {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @Column({
        type: new DataType.STRING(191),
        unique: true,
        allowNull: false
    })
    email: string;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false
    })
    password: string;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
        field: 'nama_lengkap'
    })
    namaLengkap: string;

    @Column({
        type: new DataType.STRING(191),
        allowNull: false,
        defaultValue: 'default.png'
    })
    gambar: string;

    @Column({
        type: DataType.ENUM(RoleType.Admin, RoleType.Panitia, RoleType.Pengujung),
        allowNull: true
    })
    role?: RoleType;

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
}