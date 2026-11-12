import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./user.model";

@Table({
    tableName: 'auth_tokens',
    underscored: true
})
export default class AuthToken extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    declare id_auth_token: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare token: number

    @Column({
        type: DataType.DATE
    })
    declare expired_at: Date

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare id_user: number

    @BelongsTo(() => User)
    declare user: User;
}
