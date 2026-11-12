import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import JobPosting from "../job-posting.model";

@Table({
    tableName: 'cat_employment_type',
    timestamps: false
})
export default class CatEmploymentType extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare id_cat_employment_type: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string

    @HasMany(() => JobPosting)
    declare jobPosting: JobPosting
}