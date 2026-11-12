import { AutoIncrement, Column, DataType, Default, DefaultScope, HasOne, Model, PrimaryKey, Scopes, Table } from "sequelize-typescript";
import AuthToken from "./auth-token.model";

@DefaultScope(() => ({
    attributes: {exclude: ['password']}
}))
@Scopes(() => ({
    withPassword: {
        attributes: {include: ['password']}
    },
    basic: {
        attributes: ['uuid_user', 'id_user', 'name', 'email', 'confirmed']
    }
}))
@Table({
    tableName: 'users',
    timestamps: true,
    underscored: true
})
export default class User extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    declare id_user: number

    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID
    })
    declare uuid_user: string

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare name: string

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare email: string

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare password: string

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    declare confirmed: boolean

    @HasOne(() => AuthToken)
    declare token: AuthToken[]
}
