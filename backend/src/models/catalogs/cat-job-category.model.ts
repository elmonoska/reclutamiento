import {AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import JobPosting from "../job-posting.model";

@Table({
    tableName: 'cat_job_categories',
    timestamps: false
})
export default class CatJobCategory extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    declare id_cat_job_category: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string

    @HasMany(() => JobPosting)
    declare jobPosting: JobPosting
}