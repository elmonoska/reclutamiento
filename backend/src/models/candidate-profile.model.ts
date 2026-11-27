import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./user.model";
import CatState from "./catalogs/cat-state.model";
import CatEducationLevel from "./catalogs/cat-education-level.model";
import CatExperienceLevel from "./catalogs/cat-experience-level.model";
import CatWorkModel from "./catalogs/cat-work-model.model";

@Table({
    tableName: 'candidate_profiles',
    timestamps: true,
    underscored: true
})
export default class CandidateProfile extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({ type: DataType.INTEGER })
    declare id_candidate_profile: number

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
    declare id_user: number

    @BelongsTo(() => User)
    declare user: User

    @Column({ type: DataType.STRING(20), allowNull: false })
    declare phone: string

    @Column({ type: DataType.STRING(120), allowNull: false })
    declare headline: string

    @Column({ type: DataType.TEXT, allowNull: false })
    declare summary: string

    @ForeignKey(() => CatState)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_state: number

    @BelongsTo(() => CatState)
    declare state: CatState

    @ForeignKey(() => CatEducationLevel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_education_level: number

    @BelongsTo(() => CatEducationLevel)
    declare educationLevel: CatEducationLevel

    @ForeignKey(() => CatExperienceLevel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_experience_level: number

    @BelongsTo(() => CatExperienceLevel)
    declare experienceLevel: CatExperienceLevel

    @ForeignKey(() => CatWorkModel)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_work_model: number

    @BelongsTo(() => CatWorkModel)
    declare workModel: CatWorkModel

    @Column({ type: DataType.INTEGER, allowNull: true })
    declare expected_salary: number | null

    @Column({ type: DataType.STRING(255), allowNull: true })
    declare linkedin_url: string | null

    @Column({ type: DataType.STRING(255), allowNull: true })
    declare github_url: string | null

    @Column({ type: DataType.STRING(255), allowNull: true })
    declare portfolio_url: string | null
}
