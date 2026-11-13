import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import CatCategoryJob from "./catalogs/cat-category-job.model";
import CatEmploymentType from "./catalogs/cat-employment-type.model";
import CatExperienceLevel from "./catalogs/cat-experience-level.model";
import CatEducationLevel from "./catalogs/cat-education-level.model";
import CatWorkModel from "./catalogs/cat-work-model.model";
import CatState from "./catalogs/cat-state.model";
import User from "./user.model";

@Table({
    tableName: 'job_posting',
    timestamps: true,
    underscored: true,
    paranoid: true
})
export default class JobPosting extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    declare id_job_posting: number
    
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare title: string

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare requirements: string

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare benefits: string

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare salary_min: number

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare salary_max: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare status: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare id_user: number

    @ForeignKey(() => CatState)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare id_state: number

    @ForeignKey(() => CatCategoryJob)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare id_category_job: number

    @ForeignKey(() => CatEmploymentType)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare id_employment_type: number

    @ForeignKey(() => CatExperienceLevel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare id_experience_level: number

    @ForeignKey(() => CatEducationLevel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare id_education_level: number

    @ForeignKey(() => CatWorkModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare id_work_model: number

    @BelongsTo(() => User)
    declare user: User

    @BelongsTo(() => CatState)
    declare state: CatState

    @BelongsTo(() => CatCategoryJob)
    declare categoryJob: CatCategoryJob

    @BelongsTo(() => CatEmploymentType)
    declare employmentType: CatEmploymentType

    @BelongsTo(() => CatExperienceLevel)
    declare experienceLevel: CatExperienceLevel

    @BelongsTo(() => CatEducationLevel)
    declare educationLevel: CatEducationLevel

    @BelongsTo(() => CatWorkModel)
    declare workModel: CatWorkModel
}