import { AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, Index, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./user.model";
import JobPosting from "./job-posting.model";
import CatApplicationStatus from "./cat-application-status.model";

@Table({
    tableName: 'job_applications',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            name: 'uq_job_applications_user_job_posting',
            fields: ['id_user', 'id_job_posting']
        }
    ]
})
export default class JobApplication extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({ type: DataType.INTEGER })
    declare id_job_application: number

    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare uuid_job_application: string

    @ForeignKey(() => User)
    @Index('uq_job_applications_user_job_posting')
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_user: number

    @BelongsTo(() => User)
    declare user: User

    @ForeignKey(() => JobPosting)
    @Index('uq_job_applications_user_job_posting')
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_job_posting: number

    @BelongsTo(() => JobPosting)
    declare jobPosting: JobPosting

    @ForeignKey(() => CatApplicationStatus)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_cat_application_status: number

    @BelongsTo(() => CatApplicationStatus)
    declare applicationStatus: CatApplicationStatus

    @Column({ type: DataType.STRING(500), allowNull: true })
    declare resume_snapshot_path: string | null

    @Column({ type: DataType.TEXT, allowNull: true })
    declare cover_letter: string | null
}
