import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./user.model";

@Table({
    tableName: 'candidate_resumes',
    timestamps: true,
    underscored: true
})
export default class CandidateResume extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({ type: DataType.INTEGER })
    declare id_candidate_resume: number

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
    declare id_user: number

    @BelongsTo(() => User)
    declare user: User

    @Column({ type: DataType.STRING(500), allowNull: false })
    declare storage_path: string

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare original_name: string

    @Column({ type: DataType.STRING(100), allowNull: false })
    declare mime_type: string

    @Column({ type: DataType.INTEGER, allowNull: true })
    declare size_bytes: number | null
}
