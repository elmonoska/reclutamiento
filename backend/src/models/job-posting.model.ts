import { AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import CatEmploymentType from "./catalogs/cat-employment-type.model";
import CatExperienceLevel from "./catalogs/cat-experience-level.model";
import CatEducationLevel from "./catalogs/cat-education-level.model";
import CatWorkModel from "./catalogs/cat-work-model.model";
import CatState from "./catalogs/cat-state.model";
import User from "./user.model";
import CatJobCategory from "./catalogs/cat-job-category.model";

@Table({
    tableName: 'job_postings',
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

    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID
    })
    declare uuid_job_posting: string
    
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare title: string

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare description: string

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
        type: DataType.ENUM('published', 'closed'),
        allowNull: false,
        defaultValue: 'published'
    })
    declare status: 'published' | 'closed'

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare created_by: number

    @ForeignKey(() => CatState)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare id_state: number

    @ForeignKey(() => CatJobCategory)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare id_job_category: number

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
    declare createdBy: User

    @BelongsTo(() => CatState)
    declare state: CatState

    @BelongsTo(() => CatJobCategory)
    declare jobCategory: CatJobCategory

    @BelongsTo(() => CatEmploymentType)
    declare employmentType: CatEmploymentType

    @BelongsTo(() => CatExperienceLevel)
    declare experienceLevel: CatExperienceLevel

    @BelongsTo(() => CatEducationLevel)
    declare educationLevel: CatEducationLevel

    @BelongsTo(() => CatWorkModel)
    declare workModel: CatWorkModel
}