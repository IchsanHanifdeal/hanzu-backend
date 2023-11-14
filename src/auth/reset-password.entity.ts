import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Auth } from "./auth.entity";

@Table({
    tableName: 'reset_password'
})
export class ResetPassword extends Model<ResetPassword> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'unique_code'
    })
    uniqueCode: number;

    @ForeignKey(() => Auth)
    @Column({
        type: DataType.INTEGER({ length: 10 }).UNSIGNED,
        allowNull: false,
        field: 'auth_id'
    })
    authId: number;

    @BelongsTo(() => Auth, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    auth: Auth;

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