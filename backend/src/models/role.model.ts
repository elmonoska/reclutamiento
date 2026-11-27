import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./user.model";

@Table({
    tableName: 'roles',
    timestamps: false
})
export default class Role extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare id_role: number

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        unique: true
    })
    declare name: string

    @HasMany(() => User)
    declare users: User[]
}
