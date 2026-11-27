import { AutoIncrement, BelongsTo, Column, DataType, Default, DefaultScope, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Scopes, Table } from "sequelize-typescript";
import AuthToken from "./auth-token.model";
import Role from "./role.model";
import CandidateProfile from "./candidate-profile.model";
import CandidateResume from "./candidate-resume.model";
import JobApplication from "./job-application.model";

@DefaultScope(() => ({
    attributes: {exclude: ['password']}
}))
@Scopes(() => ({
    withPassword: {
        attributes: {include: ['password']}
    },
    basic: {
        attributes: ['uuid_user', 'id_user', 'name', 'email', 'confirmed', 'id_role']
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

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare id_role: number | null

    @BelongsTo(() => Role)
    declare role: Role

    @HasOne(() => AuthToken)
    declare token: AuthToken[]

    @HasOne(() => CandidateProfile)
    declare candidateProfile: CandidateProfile

    @HasOne(() => CandidateResume)
    declare candidateResume: CandidateResume

    @HasMany(() => JobApplication)
    declare jobApplications: JobApplication[]
}
