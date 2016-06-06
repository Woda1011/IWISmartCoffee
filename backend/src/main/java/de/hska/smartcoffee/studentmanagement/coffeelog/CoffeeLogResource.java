package de.hska.smartcoffee.studentmanagement.coffeelog;

import java.util.Date;

public class CoffeeLogResource {

    private Long quota;
    private Float averageConsumption;
    private String studentName;
    private Float coffeeLevel;
    private Date coffeeLevelDate;

    public CoffeeLogResource() {
    }

    public CoffeeLogResource(Long quota, Float averageConsumption, String studentName, Float coffeeLevel, Date coffeeLevelDate) {
        this.quota = quota;
        this.averageConsumption = averageConsumption;
        this.studentName = studentName;
        this.coffeeLevel = coffeeLevel;
        this.coffeeLevelDate = coffeeLevelDate;
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

    public Float getCoffeeLevel() {
        return coffeeLevel;
    }

    public void setCoffeeLevel(Float coffeeLevel) {
        this.coffeeLevel = coffeeLevel;
    }

    public Date getCoffeeLevelDate() {
        return coffeeLevelDate;
    }

    public void setCoffeeLevelDate(Date coffeeLevelDate) {
        this.coffeeLevelDate = coffeeLevelDate;
    }
}
