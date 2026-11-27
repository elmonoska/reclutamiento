import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import JobApplication from "./job-application.model";

@Table({
    tableName: 'cat_application_statuses',
    timestamps: false
})
export default class CatApplicationStatus extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    declare id_cat_application_status: number

    @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
    declare name: string

    @HasMany(() => JobApplication)
    declare jobApplications: JobApplication[]
}
