package de.hska.smartcoffee.studentmanagement.coffeelog;

import java.util.Date;

public class CoffeeLogResource {

    private Long quota;
    private Float averageConsumption;
    private String studentName;
    private Long fillLevel;
    private Date fillLevelDate;
    private Boolean isBrewing = false;

    public CoffeeLogResource() {
    }

    public CoffeeLogResource(Long quota, Float averageConsumption, String studentName, Long fillLevel, Date fillLevelDate, Boolean isBrewing) {
        this.quota = quota;
        this.averageConsumption = averageConsumption;
        this.studentName = studentName;
        this.fillLevel = fillLevel;
        this.fillLevelDate = fillLevelDate;
        this.isBrewing = isBrewing;
    }

    public CoffeeLogResource(Long quota, Float averageConsumption) {
        this.quota = quota;
        this.averageConsumption = averageConsumption;
    }

    public Long getQuota() {
        return quota;
    }

    public void setQuota(Long quota) {
        this.quota = quota;
    }

    public Float getAverageConsumption() {
        return averageConsumption;
    }

    public void setAverageConsumption(Float averageConsumption) {
        this.averageConsumption = averageConsumption;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Date getFillLevelDate() {
        return fillLevelDate;
    }

    public void setFillLevelDate(Date fillLevelDate) {
        this.fillLevelDate = fillLevelDate;
    }

    public Long getFillLevel() {
        return fillLevel;
    }

    public void setFillLevel(Long fillLevel) {
        this.fillLevel = fillLevel;
    }

    public Boolean getBrewing() {
        return isBrewing;
    }

    public void setBrewing(Boolean brewing) {
        isBrewing = brewing;
    }
}
